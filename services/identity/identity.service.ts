import { identityRepository } from "./identity.repository";

// Service layer — business logic.
// Calls the repository. Adds validation, transformation, error handling.

export const identityService = {
  async getAllUsers() {
    const users = await identityRepository.findAllUsers();
    // Strip sensitive fields before returning
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
    const user = await identityRepository.findUserById(id);
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
    const user = await identityRepository.findUserByEmail(email);
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
