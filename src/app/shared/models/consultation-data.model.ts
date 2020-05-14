
export interface ConsultationData {
  physicalExam: any;
  investigations: any[];
  procedures: any[];
  diagnosis: any[];
  prescription: any;
  clinicalNotes: ClinicalNotesData;
}

export interface ClinicalNotesData {
  treatmentPlan: string;
  progressiveNote: string;
  admissionNote: string;
  urgentCareNote: string;
}
