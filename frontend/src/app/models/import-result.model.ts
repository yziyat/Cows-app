export interface ValidationError {
    field: string;
    message: string;
    severity: 'error' | 'warning';
}

export interface ImportRow {
    rowNumber: number;
    original: any;
    cleaned: any;
    errors: ValidationError[];
    warnings: ValidationError[];
    isValid: boolean;
}

export interface ImportResult {
    rows: ImportRow[];
    totalRows: number;
    validRows: number;
    errorRows: number;
    warningRows: number;
}

export interface ImportSummary {
    total: number;
    imported: number;
    failed: number;
    errors: string[];
}
