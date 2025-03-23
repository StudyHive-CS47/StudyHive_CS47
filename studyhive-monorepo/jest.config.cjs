module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx|mjs)$": ["babel-jest", {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-react', { runtime: 'automatic' }]
      ]
    }]
  },
  moduleFileExtensions: ["js", "jsx", "mjs", "cjs"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@shared/(.*)$": "<rootDir>/packages/shared/src/$1",
    "^@auth/(.*)$": "<rootDir>/packages/auth/src/$1",
    "^@home/(.*)$": "<rootDir>/packages/home/src/$1",
    "^@landing/(.*)$": "<rootDir>/packages/landing/src/$1",
    "^@notesharing/(.*)$": "<rootDir>/packages/features/notesharing/src/$1",
    "^@qna/(.*)$": "<rootDir>/packages/features/qna/src/$1",
    "^@groupchat/(.*)$": "<rootDir>/packages/features/groupchat/src/$1",
    "^@summarizer/(.*)$": "<rootDir>/packages/features/summarizer/src/$1",
    "^@quiz/(.*)$": "<rootDir>/packages/features/quiz/src/$1",
    "^@chat_bot/(.*)$": "<rootDir>/packages/features/chat_bot/src/$1",
    "^@userprofile/(.*)$": "<rootDir>/packages/userprofile/src/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js"
  },
  setupFiles: ["<rootDir>/jest.env.setup.js"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.cjs"],
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{js,jsx}",
    "<rootDir>/src/**/*.{spec,test}.{js,jsx}",
    "<rootDir>/packages/**/__tests__/**/*.{js,jsx}",
    "<rootDir>/packages/**/*.{spec,test}.{js,jsx}"
  ],
  testEnvironmentOptions: {
    url: "http://localhost"
  }
}; 