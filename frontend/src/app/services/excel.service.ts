import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { Cattle } from '../models/cattle.model';

@Injectable({
    providedIn: 'root'
})
export class ExcelService {

    constructor() { }

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
