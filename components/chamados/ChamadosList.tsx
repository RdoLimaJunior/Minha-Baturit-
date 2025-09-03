import React from 'react';
import { View } from '../../types';

// DEPRECATED: Use components/protocolos/ProtocolosList.tsx instead. This file will be removed.
interface ChamadosListProps {
  navigateTo: (view: View, params?: { protocoloId?: string }) => void;
}
const ChamadosList: React.FC<ChamadosListProps> = () => null;
export default ChamadosList;
