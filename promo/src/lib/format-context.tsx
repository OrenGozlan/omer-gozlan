import { createContext, useContext, type ReactNode } from 'react';
import type { Copy } from '../config/copy';
import type { Format } from '../config/formats';

type PromoContext = { format: Format; copy: Copy };

const Ctx = createContext<PromoContext | null>(null);

export const PromoProvider = ({ value, children }: { value: PromoContext; children: ReactNode }) => (
  <Ctx.Provider value={value}>{children}</Ctx.Provider>
);

export const usePromo = (): PromoContext => {
  const v = useContext(Ctx);
  if (!v) throw new Error('usePromo must be used inside <PromoProvider>');
  return v;
};

/** Pick a value per orientation. */
export const useResponsive = () => {
  const { format } = usePromo();
  return <T,>(wide: T, tall: T): T => (format.vertical ? tall : wide);
};
