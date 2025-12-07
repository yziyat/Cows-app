import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { Cattle } from '../models/cattle.model';
import { ImportResult, ImportRow, ValidationError } from '../models/import-result.model';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ExcelService {

    constructor() { }

    // New method: Read and validate with cleaning
    public readAndValidateCattleFile(file: File): Observable<ImportResult> {
        return from(this.readCattleFileRaw(file)).pipe(
            map(rawData => this.validateAndCleanData(rawData))
        );
    }

    // Original method kept for backwards compatibility
    public readCattleFile(file: File): Promise<Partial<Cattle>[]> {
        return new Promise((resolve, reject) => {
            const reader: FileReader = new FileReader();

            reader.onload = (e: any) => {
                try {
                    const binaryString: string = e.target.result;
                    const workbook: XLSX.WorkBook = XLSX.read(binaryString, { type: 'binary' });

                    // Assume first sheet
                    const sheetName: string = workbook.SheetNames[0];
                    const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

                    // Read as JSON with header support
                    const data: any[] = XLSX.utils.sheet_to_json(worksheet, { raw: false, dateNF: 'yyyy-mm-dd' });

                    const mappedCattle = this.mapDataToCattle(data);
                    resolve(mappedCattle);
                } catch (error) {
                    reject(error);
                }
            };


            reader.onerror = (error) => {
                reject(error);
            };

            reader.readAsBinaryString(file);
        });
    }

    // New method: Read raw data without mapping
    private readCattleFileRaw(file: File): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const reader: FileReader = new FileReader();

            reader.onload = (e: any) => {
                try {
                    const binaryString: string = e.target.result;
                    const workbook: XLSX.WorkBook = XLSX.read(binaryString, { type: 'binary' });

                    const sheetName: string = workbook.SheetNames[0];
                    const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

                    const data: any[] = XLSX.utils.sheet_to_json(worksheet, { raw: false, dateNF: 'yyyy-mm-dd' });
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = (error) => reject(error);
            reader.readAsBinaryString(file);
        });
    }

    // New method: Validate and clean data
    private validateAndCleanData(rawData: any[]): ImportResult {
        const rows: ImportRow[] = rawData.map((original, index) => {
            const cleaned = this.cleanRow(original);
            const errors: ValidationError[] = [];
            const warnings: ValidationError[] = [];

            // Validate required fields
            if (!cleaned.ear_tag || cleaned.ear_tag.trim() === '') {
                errors.push({ field: 'ear_tag', message: 'ID/Ear Tag is required', severity: 'error' });
            }

            // Validate dates
            if (original['BDAT'] && !cleaned.birth_date) {
                errors.push({ field: 'birth_date', message: 'Invalid birth date format', severity: 'error' });
            }

            // Validate numeric fields
            if (original['AGEDS'] && isNaN(cleaned.age_days)) {
                warnings.push({ field: 'age_days', message: 'Invalid age value', severity: 'warning' });
            }

            // Check for missing breed
            if (!cleaned.breed_code || cleaned.breed_code.trim() === '') {
                warnings.push({ field: 'breed_code', message: 'Breed code is missing', severity: 'warning' });
            }

            const isValid = errors.length === 0;

            return {
                rowNumber: index + 2, // +2 because Excel is 1-indexed and has header row
                original,
                cleaned,
                errors,
                warnings,
                isValid
            };
        });

        const validRows = rows.filter(r => r.isValid).length;
        const errorRows = rows.filter(r => !r.isValid).length;
        const warningRows = rows.filter(r => r.isValid && r.warnings.length > 0).length;

        return {
            rows,
            totalRows: rows.length,
            validRows,
            errorRows,
            warningRows
        };
    }

    // New method: Clean a single row
    private cleanRow(row: any): Partial<Cattle> {
        const cattle: Partial<Cattle> = {
            ear_tag: this.cleanString(row['ID'] || ''),
            created_at: new Date()
        };

        // Clean and map fields
        if (row['PEN']) cattle.pen = this.cleanString(row['PEN']);
        if (row['EID']) cattle.electronic_id = this.cleanString(row['EID']);
        if (row['BDAT']) cattle.birth_date = this.parseDate(row['BDAT']);
        if (row['GENDR']) cattle.sex = this.cleanString(row['GENDR']).toLowerCase().startsWith('m') ? 'male' : 'female';
        if (row['AGEDS']) cattle.age_days = this.cleanNumber(row['AGEDS']);
        if (row['CBRD']) cattle.breed_code = this.cleanString(row['CBRD']);

        // Reproduction / Production
        if (row['RPRO']) cattle.repro_status = this.cleanString(row['RPRO']);
        if (row['LACT']) cattle.lactation_number = this.cleanNumber(row['LACT']);
        if (row['DIM']) cattle.days_in_milk = this.cleanNumber(row['DIM']);
        if (row['DCC']) cattle.days_carried_calf = this.cleanNumber(row['DCC']);
        if (row['DSLH']) cattle.days_since_last_heat = this.cleanNumber(row['DSLH']);
        if (row['TBRD']) cattle.times_bred = this.cleanNumber(row['TBRD']);
        if (row['DOPN']) cattle.days_open = this.cleanNumber(row['DOPN']);
        if (row['CINT']) cattle.calving_interval = this.cleanNumber(row['CINT']);

        // Dates
        if (row['FDAT']) cattle.first_bred_date = this.parseDate(row['FDAT']);
        if (row['HDAT']) cattle.last_heat_date = this.parseDate(row['HDAT']);
        if (row['DUE']) cattle.due_date = this.parseDate(row['DUE']);

        // Sires
        if (row['SIR1']) cattle.sire1 = this.cleanString(row['SIR1']);
        if (row['SIR2']) cattle.sire2 = this.cleanString(row['SIR2']);
        if (row['SIR3']) cattle.sire3 = this.cleanString(row['SIR3']);

        // Defaults
        cattle.status = 'active';
        cattle.updated_at = new Date();

        return cattle;
    }

    // Data cleaning utilities
    private cleanString(value: any): string {
        if (value === null || value === undefined) return '';
        return String(value).trim().replace(/\s+/g, ' '); // Trim and collapse multiple spaces
    }

    private cleanNumber(value: any): number {
        if (value === null || value === undefined || value === '') return 0;
        // Remove commas, spaces, and convert to number
        const cleaned = String(value).replace(/[,\s]/g, '');
        const num = Number(cleaned);
        return isNaN(num) ? 0 : num;
    }

    private mapDataToCattle(data: any[]): Partial<Cattle>[] {
        return data.map(row => {
            const cattle: Partial<Cattle> = {
                ear_tag: String(row['ID'] || ''),
                created_at: new Date()
            };

            // Basic fields
            if (row['PEN']) cattle.pen = String(row['PEN']);
            if (row['EID']) cattle.electronic_id = String(row['EID']);
            if (row['BDAT']) cattle.birth_date = this.parseDate(row['BDAT']);
            if (row['GENDR']) cattle.sex = String(row['GENDR']).toLowerCase().startsWith('m') ? 'male' : 'female';
            if (row['AGEDS']) cattle.age_days = Number(row['AGEDS']);
            if (row['CBRD']) cattle.breed_code = String(row['CBRD']);

            // Reproduction / Production
            if (row['RPRO']) cattle.repro_status = String(row['RPRO']);
            if (row['LACT']) cattle.lactation_number = Number(row['LACT']);
            if (row['DIM']) cattle.days_in_milk = Number(row['DIM']);
            if (row['DCC']) cattle.days_carried_calf = Number(row['DCC']);
            if (row['DSLH']) cattle.days_since_last_heat = Number(row['DSLH']);
            if (row['TBRD']) cattle.times_bred = Number(row['TBRD']);
            if (row['DOPN']) cattle.days_open = Number(row['DOPN']);
            if (row['CINT']) cattle.calving_interval = Number(row['CINT']);

            // Dates
            if (row['FDAT']) cattle.first_bred_date = this.parseDate(row['FDAT']);
            if (row['HDAT']) cattle.last_heat_date = this.parseDate(row['HDAT']);
            if (row['DUE']) cattle.due_date = this.parseDate(row['DUE']);

            // Sires
            if (row['SIR1']) cattle.sire1 = String(row['SIR1']);
            if (row['SIR2']) cattle.sire2 = String(row['SIR2']);
            if (row['SIR3']) cattle.sire3 = String(row['SIR3']);

            // Defaults
            cattle.status = 'active';
            cattle.updated_at = new Date();

            return cattle;
        }).filter(c => c.ear_tag); // Filter out rows without ID
    }

    private parseDate(dateStr: any): Date | undefined {
        if (!dateStr) return undefined;
        // Handle Excel serial dates or strings
        if (typeof dateStr === 'number') {
            // Excel base date is Dec 30 1899
            return new Date(Math.round((dateStr - 25569) * 86400 * 1000));
        }
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? undefined : d;
    }
}
