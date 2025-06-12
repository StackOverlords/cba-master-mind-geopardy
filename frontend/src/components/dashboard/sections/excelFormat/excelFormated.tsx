export const handleDownloadTemplateWithExcelJS = async (categoryName: string) => {
    const ExcelJS = await import('exceljs');
    
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Plantilla', {
      properties: {
        showGridLines: false, // Ocultamos las líneas de cuadrícula para un look más limpio
      }
    });
  
    // Definimos los encabezados
    const headers = [
      'Nro', 'Question', 'A', 'B', 'C', 'D', 
      'CorrectAnswer', 'Category', 'Approved', 'Observations'
    ];
  
    // FILA DE ENCABEZADOS
    const headerRow = worksheet.addRow(headers);
    headerRow.height = 25; // Altura más generosa
  
    headerRow.eachCell((cell, colNumber) => {
      const header = headers[colNumber - 1];
      
      // Configuración de fuente premium
      cell.font = { 
        bold: true, 
        color: { argb: 'FFFFFFFF' }, // Texto blanco para mejor contraste
        size: 11,
        name: 'Segoe UI' // Fuente moderna
      };
      
      // Alineación perfecta
      cell.alignment = { 
        horizontal: 'center', 
        vertical: 'middle',
        wrapText: true
      };
      
      // Colores refinados según especificación
      let bgColor;
      if (header === 'Nro') {
        bgColor = 'FF4472C4'; // Azul profesional
      } else if (header === 'Question') {
        bgColor = 'FF7030A0'; // Púrpura elegante
      } else if (['A', 'B', 'C', 'D'].includes(header)) {
        bgColor = 'FFE26B0A'; // Naranja refinado
      } else if (header === 'CorrectAnswer') {
        bgColor = 'FF548235'; // Verde correcto
      } else if (header === 'Category') {
        bgColor = 'FFC65911'; // Naranja categórico
      } else if (header === 'Approved') {
        bgColor = 'FF548235'; // Verde aprobado
      } else {
        bgColor = 'FF548235'; // Verde observaciones
      }
      
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: bgColor }
      };
      
      // Bordes premium con grosor medio
      cell.border = {
        top: { style: 'medium', color: { argb: 'FF404040' } },
        left: { style: 'medium', color: { argb: 'FF404040' } },
        bottom: { style: 'medium', color: { argb: 'FF404040' } },
        right: { style: 'medium', color: { argb: 'FF404040' } }
      };
    });
  
    // FILA DE EJEMPLO (Pregunta de muestra)
    const exampleRow = worksheet.addRow([
      1, 
      'What is the capital of France?', 
      'Madrid', 
      'Paris', 
      'London', 
      'Berlin', 
      'B', 
      categoryName, 
      'TRUE', 
      'Example of question'
    ]);
    
    exampleRow.height = 20;
  
    // Estilos para la fila de ejemplo
    exampleRow.eachCell((cell, colNumber) => {
      // Fondo suave para identificar como ejemplo
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF2F2F2' } // Gris muy claro
      };
      
      // Fuente para datos
      cell.font = { 
        size: 10, 
        name: 'Segoe UI',
        color: { argb: 'FF404040' },
        italic: true // Cursiva para indicar que es ejemplo
      };
      
      // Alineación según columna
      if (colNumber === 1 || colNumber === 7 || colNumber === 9) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        if (colNumber === 7) { // CorrectAnswer
          cell.font = { 
            ...cell.font, 
            bold: true, 
            color: { argb: 'FF548235' } // Verde para respuesta correcta
          };
        }
      } else {
        cell.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
      }
      
      // Bordes elegantes
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFBFBFBF' } },
        left: { style: 'thin', color: { argb: 'FFBFBFBF' } },
        bottom: { style: 'thin', color: { argb: 'FFBFBFBF' } },
        right: { style: 'thin', color: { argb: 'FFBFBFBF' } }
      };
    });
  
    // FILAS DE DATOS VACÍAS (9 filas más para completar 10 total)
    for (let i = 2; i <= 2; i++) {
      const dataRow = worksheet.addRow([
        i, '', '', '', '', '', '', categoryName, 'FALSE', ''
      ]);
      dataRow.height = 20;

      dataRow.eachCell((cell, colNumber) => {
        // Alternamos colores de fondo para mejor legibilidad
        const isEvenRow = i % 2 === 0;
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: isEvenRow ? 'FFFFFFFF' : 'FFFAFAFA' }
        };
        
        // Fuente profesional
        cell.font = { 
          size: 10, 
          name: 'Segoe UI',
          color: { argb: 'FF404040' }
        };
        
        // Alineación precisa
        if (colNumber === 1) {
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
          cell.font = { ...cell.font, bold: true }; // Números en negrita
        } else if (colNumber === 7 || colNumber === 9) {
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
        } else {
          cell.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
        }
        
        // Bordes suaves
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE0E0E0' } },
          left: { style: 'thin', color: { argb: 'FFE0E0E0' } },
          bottom: { style: 'thin', color: { argb: 'FFE0E0E0' } },
          right: { style: 'thin', color: { argb: 'FFE0E0E0' } }
        };
        
        // Validación de datos para CorrectAnswer
        if (colNumber === 7) {
          cell.dataValidation = {
            type: 'list',
            allowBlank: false,
            formulae: ['"A,B,C,D"'],
            showErrorMessage: true,
            errorTitle: 'Invalid value',
            error: 'Please select A, B, C or D'
          };
        }
        
        // Validación para Approved
        if (colNumber === 9) {
          cell.dataValidation = {
            type: 'list',
            allowBlank: false,
            formulae: ['"TRUE,FALSE"'],
            showErrorMessage: true,
            errorTitle: 'Invalid value',
            error: 'Please select TRUE or FALSE'
          };
        }
      });
    }
  
    // CONFIGURACIÓN AVANZADA DE COLUMNAS
    worksheet.columns = [
      { 
        width: 8,
        style: { alignment: { horizontal: 'center' } }
      },   // Nro
      { 
        width: 50,
        style: { alignment: { wrapText: true } }
      },  // Question
      { width: 20 },  // A
      { width: 20 },  // B
      { width: 20 },  // C
      { width: 20 },  // D
      { 
        width: 18,
        style: { alignment: { horizontal: 'center' } }
      },  // CorrectAnswer
      { 
        width: 15,
        style: { alignment: { horizontal: 'center' } }
      },  // Category
      { 
        width: 12,
        style: { alignment: { horizontal: 'center' } }
      },  // Approved
      { 
        width: 25,
        style: { alignment: { wrapText: true } }
      },  // Observations
    ];
  
    // CONFIGURACIÓN DE IMPRESIÓN Y VISTA
    worksheet.pageSetup = {
      paperSize: 9, // A4
      orientation: 'landscape',
      fitToPage: true,
      margins: {
        left: 0.7, right: 0.7,
        top: 0.75, bottom: 0.75,
        header: 0.3, footer: 0.3
      }
    };
  
    // Congelamos la primera fila para navegación
    worksheet.views = [
      {
        state: 'frozen',
        ySplit: 1,
        activeCell: 'A2',
        showGridLines: false
      }
    ];
  
    // METADATOS DEL ARCHIVO
    workbook.creator = 'Master Mind Geopardy';
    workbook.lastModifiedBy = 'AutoGenerator';
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.lastPrinted = new Date();
    
    // GENERACIÓN Y DESCARGA DEL ARCHIVO
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Nombre de archivo con timestamp para evitar conflictos
    // const timestamp = new Date().toISOString().slice(0, 10);
    link.download = `${categoryName.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`;
    
    // Descarga elegante
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    
    // Limpieza inmediata
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
    
  };