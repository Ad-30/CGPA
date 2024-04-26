import { NextRequest, NextResponse } from 'next/server';
import PDFParser from 'pdf2json';
import { promisify } from 'util';

export async function POST(req: NextRequest) {
    var grade_points: { [key: string]: number } = {'A++': 10, 'A+': 9, 'A': 8.5, 'B+': 8, 'B': 7.5, 'C+': 7, 'C': 6.5, 'D+': 6, 'D': 5.5, 'E+': 5, 'E': 4, 'F': 0};
    var credit_points: { [key: string]: number } = {'7CS4-01':3,'7CS4-21 ':2,'7CS4-22 ':2,'7CS7-30':2.5,'7CS7-40':2,'8CS4-01 ':3,'8CS4-21 ':1,'8CS4-22 ':1,'8CS7-50 ':7,'6CS3-01':2,'6CS4-02 ':3,'6CS4-03':2,'6CS4-04 ':3,'6CS4-05 ':2,'6CS4-06':3,'6CS5-11':2,'6CS5-12 ':2,'6CS5-13':2,'6CS4-21 ':1.5,'6CS4-22':1.5,'6CS4-23':1.5,'6CS4-24':1.5,'5CS3-01':2,'5CS4-02':3,'5CS4-03':3,'5CS4-04':3,'5CS4-05':3,'5CS5-11':2,'5CS5-12':2,'5CS5-13':2,'5CS4-21':1,'5CS4-22':1,'5CS4-23':1,'5CS4-24':1,'5CS7-30':2.5,'5CS8-00':0.5,'4CS2-01': 3, '4CS1-03': 2, '4CS3-04': 3, '4CS4-05': 3, '4CS4-06': 3, '4CS4-07': 3, '4CS1-02': 2, '4CS4-21': 1, '4CS4-22': 1.5, '4CS4-23': 1.5, '4CS4-24': 1, '4CS4-25': 1, '3CS2-01': 3, '3CS1-02': 2, '3CS1-03': 2, '3CS3-04': 3, '3CS4-05': 3, '3CS4-06': 3, '3CS4-07': 3, '3CS4-21': 1.5, '3CS4-22': 1.5, '3CS4-23': 1.5,'3CS4-24':1.5,'3CS7-30':1,'1FY2-01':4,'1FY2-02':4,'2FY2-02':4,'1FY2-03':4,'2FY2-03':4,'1FY1-04':2,'2FY1-04':2,'1FY1-05':2,'2FY1-05':2,'1FY3-06':2,'2FY3-06':2,'1FY3-07':2,'2FY3-07':2,'1FY3-08':2,'2FY3-08':2,'1FY3-09':2,'2FY3-09':2,'1FY2-20':1,'2FY2-20':1,'1FY2-21':1,'2FY2-21':1,'1FY2-22':1,'2FY2-22':1,'1FY2-23':1,'2FY2-23':1,'1FY3-24':1.5,'2FY3-24':1.5,'1FY3-25':1.5,'2FY3-25':1.5,'1FY3-26':1,'2FY3-26':1,'1FY3-27':1,'2FY3-27':1,'1FY3-28':1.5,'2FY3-28':1.5,'1FY3-29':1.5,'2FY3-29':1.5,'2FY2-01':4,'2FY1-22':1,'1FY1-22':1,'2FY8DC':0.5,'1FY8DC':0.5};
    var match;
    var totalGradePoints = 0;
    var totalCredits = 0;
    var sgpa;

    interface Subject {
        subjectCode: string;
        grade: string;
    }

    const subjects: Subject[] = [];

    try {
        const formData = await req.formData();
        const file = formData.get('file');
        let fileName = '';
        let parsedText = '';
        var gradeLast = '';

        if (!file) {
            throw new Error('File not found in the request.');
        }


        const arrayBuffer = await new Response(file as Blob).arrayBuffer();
        const fileBuffer = Buffer.from(arrayBuffer);
        const pdfParser = new (PDFParser as any)(null, 1);
        const pdfPromise = new Promise<void>((resolve, reject) => {
          pdfParser.on('pdfParser_dataError', reject);

          pdfParser.on('pdfParser_dataReady', () => {
              const parsedText = pdfParser.getRawTextContent();
              const regex = /(\d+CS\d{1}-\d{2})\d{3}\s*(\w+\+*\w*)/g;
              while ((match = regex.exec(parsedText)) !== null) {
                const subjectCode = match[1];
                var grade = match[2][1];
                if (match[2][2]) {
                  grade += match[2][2];
                }
                if (match[2][3]) {
                  grade += match[2][3];
                }
                const credit = credit_points[subjectCode];
                if (grade in grade_points && credit) {
                    const gradePoint = grade_points[grade];
                    totalGradePoints += gradePoint * credit;
                    totalCredits += credit;
                } 
              }
              const lines = parsedText.split('\n');
              const remarksIndex = lines.findIndex((line: string) => line.includes("REMARKS"));
              let concatenatedString = '';
              if (remarksIndex > 0) {
                const lineBeforeRemarks = lines[remarksIndex - 1];
                const inputString  = lineBeforeRemarks.slice(-5);
                const gradePattern = /[A-F]\+*\+*/;
                const gradeMatch = inputString.match(gradePattern);
                if (gradeMatch !== null) {
                  gradeLast = gradeMatch[0];
                }  
              }
              totalGradePoints += grade_points[gradeLast] * 0.5;
              totalCredits += 0.5;
              sgpa = totalGradePoints / totalCredits;
              sgpa = sgpa.toFixed(2);
              resolve();
          });
      });
      pdfParser.parseBuffer(fileBuffer);
      await pdfPromise;
      return NextResponse.json({ 'cgpa': sgpa }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Invalid Request", error }, { status: 500 });
    }
}
