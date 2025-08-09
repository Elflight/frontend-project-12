import LeoProfanity from 'leo-profanity';

const ruDict = LeoProfanity.getDictionary('ru')
LeoProfanity.add(ruDict)

export const cleanProfanity = (text) => {
  if (!text || typeof text !== 'string') {
    return text;
  }
  return LeoProfanity.clean(text);
};

export const hasProfanity = (text) => {
  if (!text || typeof text !== 'string') {
    return false;
  }
  return LeoProfanity.check(text);
};

export default LeoProfanity;