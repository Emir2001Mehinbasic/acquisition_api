export const  formatValidationErrors = (errors) => {
  if(!errors || !errors.issues) return 'Validation failed';

  if(Array.isArray(errors.issues)){
    return errors.issues.map(i => i.message).join(', ');
    // eslint-disable-next-line no-unreachable
    return JSON.stringify(errors);
  }};