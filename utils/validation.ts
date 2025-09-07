export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.trim().length >= minLength;
};

export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.trim().length <= maxLength;
};

export const validateUrl = (url: string): boolean => {
  if (!url) return true; // Optional field
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateDate = (date: string): boolean => {
  if (!date) return false;
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
};

export const validateDateRange = (startDate: string, endDate: string): boolean => {
  if (!startDate || !endDate) return true;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return start <= end;
};

export const validateGPA = (gpa: string): boolean => {
  if (!gpa) return true; // Optional field
  
  const num = parseFloat(gpa);
  return !isNaN(num) && num >= 0 && num <= 4.0;
};

export const getFieldError = (field: string, value: string, rules: any): string => {
  if (rules.required && !validateRequired(value)) {
    return `${field} 為必填欄位`;
  }
  
  if (rules.minLength && !validateMinLength(value, rules.minLength)) {
    return `${field} 至少需要 ${rules.minLength} 個字元`;
  }
  
  if (rules.maxLength && !validateMaxLength(value, rules.maxLength)) {
    return `${field} 不能超過 ${rules.maxLength} 個字元`;
  }
  
  if (rules.email && !validateEmail(value)) {
    return '請輸入有效的電子郵件地址';
  }
  
  if (rules.phone && !validatePhone(value)) {
    return '請輸入有效的電話號碼';
  }
  
  if (rules.url && !validateUrl(value)) {
    return '請輸入有效的網址';
  }
  
  return '';
};

export const validateResumeData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Validate personal info
  if (!validateRequired(data.personalInfo?.firstName)) {
    errors.push('姓名為必填欄位');
  }
  
  if (!validateRequired(data.personalInfo?.email)) {
    errors.push('電子郵件為必填欄位');
  } else if (!validateEmail(data.personalInfo.email)) {
    errors.push('請輸入有效的電子郵件地址');
  }
  
  if (data.personalInfo?.phone && !validatePhone(data.personalInfo.phone)) {
    errors.push('請輸入有效的電話號碼');
  }
  
  // Validate experience
  if (data.experience && data.experience.length > 0) {
    data.experience.forEach((exp: any, index: number) => {
      if (!validateRequired(exp.company)) {
        errors.push(`工作經驗 ${index + 1}: 公司名稱為必填欄位`);
      }
      if (!validateRequired(exp.position)) {
        errors.push(`工作經驗 ${index + 1}: 職稱為必填欄位`);
      }
      if (!validateDate(exp.startDate)) {
        errors.push(`工作經驗 ${index + 1}: 請選擇開始日期`);
      }
      if (!exp.current && !validateDate(exp.endDate)) {
        errors.push(`工作經驗 ${index + 1}: 請選擇結束日期`);
      }
      if (!exp.current && exp.startDate && exp.endDate) {
        if (!validateDateRange(exp.startDate, exp.endDate)) {
          errors.push(`工作經驗 ${index + 1}: 結束日期不能早於開始日期`);
        }
      }
    });
  }
  
  // Validate education
  if (data.education && data.education.length > 0) {
    data.education.forEach((edu: any, index: number) => {
      if (!validateRequired(edu.institution)) {
        errors.push(`教育經歷 ${index + 1}: 學校名稱為必填欄位`);
      }
      if (!validateRequired(edu.degree)) {
        errors.push(`教育經歷 ${index + 1}: 學位為必填欄位`);
      }
      if (!validateDate(edu.startDate)) {
        errors.push(`教育經歷 ${index + 1}: 請選擇開始日期`);
      }
      if (!edu.current && !validateDate(edu.endDate)) {
        errors.push(`教育經歷 ${index + 1}: 請選擇結束日期`);
      }
      if (edu.gpa && !validateGPA(edu.gpa)) {
        errors.push(`教育經歷 ${index + 1}: GPA 必須在 0-4.0 之間`);
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
