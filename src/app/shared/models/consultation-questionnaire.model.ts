import {Gender, Status, ValueType} from "./common.model";

export interface ConsultationQuestion {
  id: number;
  question: string;
  value_type: ValueType;
  gender: Gender;
  status: Status;
  isActivated?: boolean;
}

export interface ConsultationQuestionOption {
  id: number;
  consultation_question_id: number;
  value: string;
  gender: Gender;
  status: Status;
  isActivated?: boolean;
}
