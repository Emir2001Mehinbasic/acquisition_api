import logger from "#config/logger.js"
import { signUpSchema } from "#validations/auth.validation.js";
import { formatValidationErrors } from "#utils/format.js";
import { createUser } from "#services/auth.service.js";
import { jwttoken } from "#utils/jwt.js";
import { cookies } from "#utils/cookies.js";

export const signUp = async (req, res , next) =>{
    try{
      const validationResult = signUpSchema.safeParse(req.body);
      if(!validationResult.success){
        return res.status(400).json({
          error: 'Validation failed',
          details: formatValidationErrors(validationResult.error),
        });
      }
      const {name, email, password, role} = validationResult.data;
      const user = await createUser({name, email, password, role});

      const token = jwttoken({id: user.id, email: user.email, role:user.role})

      cookies.setCookie(res, 'token', token)

      //AuthService 



      logger.info(`User with email : ${email} signed up successfully`)

      res.status(201).json({ message: 'User signed up successfully',
        user: {id: user.id, name: user.name, email: user.email, role: user.role}
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