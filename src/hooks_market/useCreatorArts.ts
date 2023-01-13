import { useMeta } from 'src/contexts/meta';
import { StringPublicKey } from '@oysterr/common';

export const useCreatorArts = (id?: StringPublicKey) => {
  const { metadata } = useMeta();
  const filtered = metadata.filter(m =>
    m.info.data.creators?.some(c => c.address === id),
  );

  return filtered;
};
