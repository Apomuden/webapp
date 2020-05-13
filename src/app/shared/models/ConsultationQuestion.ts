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

enum Status {
  ACTIVE = 'ACTIVE', INACTIVE = 'INACTIVE'
}

enum Gender {
  MALE = 'MALE', FEMALE = 'FEMALE', ALL = 'MALE,FEMALE'
}

enum ValueType {
  TEXT = 'Text', NUMBER = 'Number', BOOLEAN = 'True/False', SELECT = "Select"
}
