declare module 'xlsx-style' {
    export interface WorkSheet {
        [key: string]: any;
    }

    export interface WorkBook {
        SheetNames: string[];
        Sheets: { [key: string]: WorkSheet };
    }

    export interface XLSXOptions {
        type: 'array' | 'base64' | 'binary' | 'buffer';
        bookType: 'xlsx' | 'xlsb' | 'xlsm' | 'xls' | 'biff8' | 'biff5';
        cellStyles: boolean;
        [key: string]: any;
    }

    export function write(workbook: WorkBook, options: XLSXOptions): any;
    export function writeFile(workbook: WorkBook, filename: string, options?: XLSXOptions): boolean;
    export function writeFileAsync(workbook: WorkBook, filename: string, options?: XLSXOptions): Promise<boolean>;

    export namespace utils {
        function json_to_sheet(data: any[], opts?: { header?: string[] }): WorkSheet;
        function sheet_to_json(ws: WorkSheet, opts?: { header?: string[] }): any[];
        function encode_cell(cell: any): string;
        function book_new(): WorkBook;
        function book_append_sheet(workbook: WorkBook, worksheet: WorkSheet, name: string): WorkBook;
    }
}
