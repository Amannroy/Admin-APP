import bcrypt from "bcryptjs";

const hashPassword = async() => {
    const hash = await bcrypt.hash("1234", 10);
    console.log(hash);
}

hashPassword();