import { useEffect } from 'react';
import { MacroService } from '~/services/macro.service';
import { useMacroStore } from '~/store/macroStore';
import { catchError } from '~/utils/catchError';

export const useMacros = () => {

  const { macros, setMacros } = useMacroStore();

  const getMacros = async () => {
      const [error, data] = await catchError(MacroService.getMacro());
      if (error) {
      } else if (data) {
        setMacros(data);
      }
  };

  const updateMacros = async (macroButtonId: number, playlistId: number) => {
    await catchError(MacroService.updateMacros(macroButtonId, playlistId));
  };

  useEffect(() => {
    console.log("MacroUseEffect");
    getMacros();
  }, []);


  return {
    updateMacros,
    getMacros,
    macros,
  };
};
