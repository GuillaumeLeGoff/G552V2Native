import { useEffect } from 'react';
import { MacroService } from '~/services/macro.service';
import { useMacroStore } from '~/store/macroStore';
import { Macro } from '~/types/Macro';

export const useMacros = () => {

  const { macros, setMacros } = useMacroStore();

  const getMacros = async () => {
    try {
      const data = await MacroService.getMacro();
      setMacros(data);
    } catch (error) {
      console.error("Failed to fetch macros", error);
    }
  };

  const updateMacros = async () => {
    try {
   
    } catch (error) {
      console.error("Failed to fetch macros", error);
    }
  };
  


  return {
    getMacros,
    macros,
  };
};