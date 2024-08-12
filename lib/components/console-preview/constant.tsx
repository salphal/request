import {
  CloseCircleOutlined,
  InfoCircleOutlined,
  UnorderedListOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import React from 'react';

export const previewConsoleAsideConfig = [
  {
    key: 'all',
    label: 'Messages',
    icon: <UnorderedListOutlined />,
  },
  {
    key: 'info',
    label: 'Info',
    icon: <InfoCircleOutlined />,
  },
  {
    key: 'warn',
    label: 'Warn',
    icon: <WarningOutlined />,
  },
  {
    key: 'error',
    label: 'Error',
    icon: <CloseCircleOutlined />,
  },
];
