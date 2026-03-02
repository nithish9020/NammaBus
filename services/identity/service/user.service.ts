import { userRepository } from "../repository";

export const userService = {
  async getAllUsers() {
    const users = await userRepository.findAllUsers();
    return users.map(({ id, name, email, emailVerified, image, createdAt }) => ({
      id,
      name,
      email,
      emailVerified,
      image,
      createdAt,
    }));
  },

  async getUserById(id: string) {
    const user = await userRepository.findUserById(id);
    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      createdAt: user.createdAt,
    };
  },

  async getUserByEmail(email: string) {
    const user = await userRepository.findUserByEmail(email);
    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      createdAt: user.createdAt,
    };
  },
};
