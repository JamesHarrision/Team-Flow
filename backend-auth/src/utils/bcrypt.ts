import bcrypt from 'bcrypt'

const saltRounds = 10;

export const hashPassword = async (password_raw: string) => {
  return await bcrypt.hash(password_raw, saltRounds);
}

export const comparePassword = async (password_raw: string, hashedPassword: string) => {
  return await bcrypt.compare(password_raw, hashedPassword);
}
 