import { Request, Response } from "express";
import { QuestionService } from "../../core/services/question.service";
import { asyncHandler } from "../middlewares/async.middleware";
import { CustomError } from "../middlewares/error.middleware";
import * as xlsx from 'xlsx';
import fs from 'fs';
import { IQuestion } from "../../core/models/Question.Model";
import mongoose from "mongoose";
interface RequestExtend extends Request {
    user?: { uid: string;[key: string]: any }
}
export class QuestionController {
    private questionService: QuestionService;
    constructor() {
        this.questionService = new QuestionService();
    }

    createQuestion = asyncHandler(async (req: Request, res: Response) => {
        const question = await this.questionService.createQuestion(req.body);
        res.status(201).json(question);
    })

    findAll = asyncHandler(async (req: Request, res: Response) => {
        const queston = await this.questionService.findAll();
        res.status(201).json(queston);
    })

    findById = asyncHandler(async (req: Request, res: Response) => {
        const question = await this.questionService.findById(req.params.id);
        res.status(201).json(question);
    })

    update = asyncHandler(async (req: Request, res: Response) => {
        const question = await this.questionService.update(req.params.id, req.body);
        res.status(201).json(question);
    })

    delete = asyncHandler(async (req: Request, res: Response) => {
        await this.questionService.delete(req.params.id);
        res.status(201).json({ message: "Question deleted successfully" })
    }) 

    importExcelQuestions = asyncHandler(async (req: RequestExtend, res: Response) => {
        if (!req.file) {
            throw new CustomError('No se ha proporcionado ningún archivo', 400);
        }
        
        try {
            // Leer el archivo Excel
            const workbook = xlsx.readFile(req.file.path);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            
            // Convertir a JSON
            const jsonData = xlsx.utils.sheet_to_json(worksheet);
            
            if (jsonData.length === 0) {
                throw new CustomError('El archivo Excel está vacío', 400);
            }
            
            // Validar y transformar los datos
            const questions: IQuestion[] = [];
            const errors: string[] = [];
            
            // Obtener el usuario del token (asumiendo que está en req.user después de authenticateToken)
            const uid = req.user?.uid;

            if (!uid) {
                throw new CustomError('No se pudo determinar el usuario para asociar con las preguntas', 400);
            }
            let categoryExtract = '';
            jsonData.forEach((row: any, index: number) => {
                try { 
                    const nro = row.Nro || row.NroQuestion || row['Nro Question'] || '';
                    const questionText = row.Question || '';
                    const optionA = row.A || '';
                    const optionB = row.B || '';
                    const optionC = row.C || '';
                    const optionD = row.D || '';
                    const correctAnswer = row.CorrectAnswer || row['Correct Answer'] || '';
                    const category = row.Category || '';
                    categoryExtract = category;
                    const approved = (row.Approved || '').toString().toUpperCase() === 'TRUE';
                    
                    if (!questionText) {
                        errors.push(`Fila ${index + 2}: La pregunta es obligatoria`);
                        return;
                    }
                    
                    if (!correctAnswer || !['A', 'B', 'C', 'D'].includes(correctAnswer.toUpperCase())) {
                        errors.push(`Fila ${index + 2}: La respuesta correcta debe ser A, B, C o D`);
                        return;
                    }
                    
                    const answers = [
                        { text: optionA, isCorrect: correctAnswer.toUpperCase() === 'A' },
                        { text: optionB, isCorrect: correctAnswer.toUpperCase() === 'B' },
                        { text: optionC, isCorrect: correctAnswer.toUpperCase() === 'C' },
                        { text: optionD, isCorrect: correctAnswer.toUpperCase() === 'D' }
                    ];
                    
                    const question: IQuestion = {
                        question: questionText,
                        isDeleted: false,
                        answers: answers
                    } as IQuestion;
                    
                    questions.push(question);
                } catch (error) {
                    errors.push(`Fila ${index + 2}: Error al procesar la pregunta - ${error}`);
                }
            });
            
            if (errors.length > 0) {
                throw new CustomError(`Se encontraron ${errors.length} errores en el archivo:\n${errors.join('\n')}`, 400);
            }
            
            if (questions.length === 0) {
                throw new CustomError('No se encontraron preguntas válidas para importar', 400);
            }
            
            const savedQuestions = await this.questionService.createManyQuestions(questions, uid, categoryExtract);

            // Eliminar el archivo temporal
            fs.unlinkSync(req.file.path);
            res.status(201).json({
                message: `Se importaron ${savedQuestions?.length || 0} preguntas correctamente`,
                questions: savedQuestions
            });
        } catch (error: any) {
            // Eliminar el archivo en caso de error
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            throw new CustomError(error.message || 'Error al procesar el archivo Excel', error.statusCode || 400);
        }
    });
}