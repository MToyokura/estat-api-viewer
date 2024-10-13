const numberPattern = /^\d+$/;
const surveyYearsPattern = /^(?:\d{4}|\d{6}|\d{6}-\d{6})$/;
const statsFieldPattern = /^(?:\d{2}|\d{4}|)$/;
const statsCodePattern = /^(?:\d{5}|\d{8}|)$/;
const updatedDatePattern = /^(?:\d{4}|\d{6}|\d{8}|\d{8}-\d{8})$/;

export function validateIsNumber(value: string) {
  return regexValidator(numberPattern, value);
}

export function validateSurveyYears(value: string) {
  return regexValidator(surveyYearsPattern, value);
}

export function validateOpenYears(value: string) {
  return regexValidator(surveyYearsPattern, value);
}

export function validateStatsField(value: string) {
  return regexValidator(statsFieldPattern, value);
}

export function validateStatsCode(value: string) {
  return regexValidator(statsCodePattern, value);
}

export function validateUpdatedDate(value: string) {
  return regexValidator(updatedDatePattern, value);
}

function regexValidator(pattern: RegExp, value: string) {
  if (!value) {
    return true;
  }
  if (pattern.test(value)) {
    return true;
  }
  return false;
}
