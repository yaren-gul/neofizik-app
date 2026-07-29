import React from 'react';
import { useParams } from 'react-router-dom';
import { getModule } from '../data/modulesData';
import ModuleTopics from './ModuleTopics';
import BodyAtlas from './BodyAtlas';

export default function ModuleHome() {
  const { moduleId } = useParams();
  const mod = getModule(moduleId);
  if (mod?.type === 'body') return <BodyAtlas />;
  return <ModuleTopics />;
}
