import {Gender, Status, ValueType} from "./common.model";

export interface ConsultationQuestion {
  id: number;
  question: string;
  value_type: ValueType;
  gender: Gender;
  status: Status;
  isActivated?: boolean;
  isLoadingOptions?: boolean;
  options?: ConsultationQuestionOption[];
}

export interface ConsultationQuestionOption {
  id: number;
  consultation_question_id: number;
  value: string;
  gender: Gender;
  status: Status;
  isActivated?: boolean;
}

export interface ConsultationQuestionResponse {
  id: number;
  consultation_question_id: number;
  consultation_question?: string;
  consultation_id: number;
  consultant_id?: number;
  consultant_name?: string;
  response: string;
  response_date: Date;
  value_type: ValueType;
  gender: Gender;
  status: Status;
  isActivated?: boolean;
}

export interface ConsultationGroupedResponses {
  consultation_id: number;
  consultation_date: Date;
  consultant_name: string;
  responses: ConsultationQuestionResponse[];
  // UI variables
  panelActive?: boolean;
}
