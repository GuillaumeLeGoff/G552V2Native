import { useEffect } from 'react';
import { MacroService } from '~/services/macro.service';
import { useMacroStore } from '~/store/macroStore';
import { Macro } from '~/types/Macro';
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
   const [error] = await catchError(MacroService.updateMacros(macroButtonId, playlistId));
   if (error) {
      console.log(error);
   }
  };
  


  return {
    updateMacros,
    getMacros,
    macros,
  };
};
