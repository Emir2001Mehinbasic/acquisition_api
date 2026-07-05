import logger from "#config/logger.js"
import { signUpSchema } from "#validations/auth.validation.js";
import { formatValidationErrors } from "#utils/format.js";

export const signUp = async (req, res , next) =>{
    try{
      const validationResult = signUpSchema.safeParse(req.body);
      if(!validationResult.success){
        return res.status(400).json({
          error: 'Validation failed',
          details: formatValidationErrors(validationResult.error),
        });
      }
      const {name, email, role} = validationResult.data;

      //AuthService 

      logger.info(`User with email : ${email} signed up successfully`)

      res.status(201).json({ message: 'User signed up successfully',
        user: {id: 1, name, email, role}
       });


    }
    catch(e){
        logger.error(`Error in signUp controller: ${e.message}`);

        if(e.message === 'User with this email already exists'){
            return res.status(409).json({ error: e.message });
        }
        next(e);
    }
}