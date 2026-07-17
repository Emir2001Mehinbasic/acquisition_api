const createMockInstance = () => {
  const instance = {
    withRule: () => instance,
    protect: async () => ({
      isAllowed: () => true,
      isDenied: () => false,
      reason: {
        isRateLimit: () => false,
        isBot: () => false,
        isShield: () => false,
      },
    }),
  };
  return instance;
};

// Obične funkcije umjesto jest.fn()
export const arcjet = () => createMockInstance();
export const shield = () => ({});
export const detectBot = () => ({});
export const slidingWindow = () => ({});

export default arcjet;
