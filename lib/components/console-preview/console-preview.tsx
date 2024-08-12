import React, {
  type ForwardRefRenderFunction,
  type Ref,
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  useMemo,
} from 'react';
import { Button, Empty, Input, List, Menu, Select, Typography } from 'antd';
import {
  CloseCircleOutlined,
  InfoCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  StopOutlined,
  UnorderedListOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import './index.scss';
import { previewConsoleAsideConfig } from '@lib/components/console-preview/constant.tsx';
import classNames from 'classnames';

export interface ConsolePreviewProps {
  height?: number;
}

export interface ConsolePreviewRef {}

const ConsolePreview: ForwardRefRenderFunction<ConsolePreviewRef, ConsolePreviewProps> = (
  props: ConsolePreviewProps,
  ref: Ref<ConsolePreviewRef | HTMLDivElement>,
) => {
  const { height = 300 } = props;

  const [query, setQuery] = useState<string>('');
  const [showAsideMenu, setShowAsideMenu] = useState<boolean>(false);
  const [messageList, setMessageList] = useState<Array<string>>([]);

  const [infoList, setInfoList] = useState<Array<string>>([]);
  const [warnList, setWarnList] = useState<Array<string>>([]);
  const [errorList, setErrorList] = useState<Array<string>>([]);

  const [level, setLevel] = useState<'all' | 'info' | 'warn' | 'error'>('all');

  const listDataSource = useMemo(
    () => () => {
      let result: string[] = [];
      if (level === 'info') {
        result = infoList;
      } else if (level === 'warn') {
        result = warnList;
      } else if (level === 'error') {
        result = errorList;
      } else {
        result = messageList;
      }
      return result.filter((v) => v.indexOf(query) !== -1);
    },
    [level, query, messageList, infoList, warnList, errorList],
  );

  const originalConsoleLog = console.log;
  const originalConsoleInfo = console.info;
  const originalConsoleWarn = console.warn;
  const originalConsoleError = console.error;

  useImperativeHandle(ref, () => ({}));

  useEffect(() => {
    console.log = function (message, ...restArgs) {
      setMessageList((p: Array<string>) => [...p, message]);
      originalConsoleLog.apply(console, [message, ...restArgs]);
    };
    console.info = function (message, ...restArgs) {
      setInfoList((p: Array<string>) => [...p, message]);
      setMessageList((p: Array<string>) => [...p, message]);
      originalConsoleInfo.apply(console, [message, ...restArgs]);
    };
    console.warn = function (message, ...restArgs) {
      setWarnList((p: Array<string>) => [...p, message]);
      setMessageList((p: Array<string>) => [...p, message]);
      originalConsoleWarn.apply(console, [message, ...restArgs]);
    };
    console.error = function (message, ...restArgs) {
      setErrorList((p: Array<string>) => [...p, message]);
      setMessageList((p: Array<string>) => [...p, message]);
      originalConsoleError.apply(console, [message, ...restArgs]);
    };
    console.log('test_log');
    console.log('test_log');
    console.log('test_log');
    console.info('test_info');
    console.warn('test_warn');
    console.error('test_error');
  }, []);

  return (
    <React.Fragment>
      <div
        className={'console-preview w-full h-full'}
        style={{
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}
      >
        <div
          className={'console-preview-header flex flex-row justify-between items-center'}
          style={{
            padding: '0 12px',
            backgroundColor: '#eee',
            height: '40px',
            lineHeight: '40px',
            borderBottom: '1px solid #ccc',
          }}
        >
          <span className={'console-preview-header-left'}>
            <Button
              icon={showAsideMenu ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
              size={'small'}
              style={{ marginRight: '10px' }}
              onClick={() => setShowAsideMenu((show) => !show)}
            />
            <Button
              icon={<StopOutlined />}
              size={'small'}
              onClick={() => {
                setInfoList([]);
                setWarnList([]);
                setErrorList([]);
                console.clear();
              }}
            />
          </span>
          <span className={'flex-1 px-3'}>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              size={'small'}
              placeholder={'Filter'}
              style={{
                margin: '0 auto',
                width: '100%',
                height: '24px',
                boxSizing: 'border-box',
              }}
            />
          </span>
          <span className={'console-preview-header-right'}>
            <Select
              value={level}
              onChange={setLevel}
              options={['all', 'info', 'warn', 'error'].map((v) => ({ label: v, value: v }))}
              size={'small'}
              style={{ width: '80px', height: '24px', boxSizing: 'border-box' }}
            />
          </span>
          <span style={{ padding: '0 0 0 10px', color: '#999', fontSize: '12px' }}>
            {listDataSource().length}/{messageList.length}
          </span>
        </div>
        <div
          className={'console-preview-content flex flex-row justify-between'}
          style={{
            height: height || 'auto',
            overflow: 'hidden',
            color: '#333',
          }}
        >
          <div className={'preview-content-aside h-full'}>
            {showAsideMenu && (
              <Menu
                selectedKeys={[level]}
                className={'preview-console-aside-menu h-full'}
                onClick={(value) => {
                  setLevel(value.key as any);
                }}
                mode="inline"
                items={previewConsoleAsideConfig}
                style={{ width: '180px', borderRightColor: 'rgba(5, 5, 5, 0.1)' }}
              />
            )}
          </div>
          <div
            className={'preview-content-messages flex-1 h-full'}
            style={{
              padding: '12px',
              overflow: 'hidden auto',
            }}
          >
            {listDataSource().length ? (
              <List
                dataSource={listDataSource()}
                renderItem={(item) => (
                  <div
                    className={classNames({
                      'console-msg': true,
                      'console-msg-info': infoList.includes(item),
                      'console-msg-warn': warnList.includes(item),
                      'console-msg-error': errorList.includes(item),
                    })}
                    style={{
                      padding: '8px 0px 8px 6px',
                      borderBottom: '1px solid rgba(5, 5, 5, 0.1)',
                      fontSize: '12px',
                      lineHeight: '1.5em',
                    }}
                  >
                    {item}
                  </div>
                )}
                size={'small'}
              />
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default React.forwardRef(ConsolePreview);
