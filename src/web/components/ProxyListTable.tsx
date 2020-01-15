import React from 'react';
import { Table, Icon, Modal } from 'antd';
import { PathRewrite, ProxySettings } from '../types/types';
import s from './less/popup.less';

interface Props {
  selectedKeys: string[] | number[];
  proxies: ProxySettings[];
  onSelectionChange?: (selectedKeys: string[] | number[]) => void;
  onDelete?: (origin: string) => void;
}

const { Column } = Table;
export default function ApiListTable({
  selectedKeys,
  proxies,
  onSelectionChange,
  onDelete,
}: Props) {
  return (
    <Table
      dataSource={proxies}
      bordered={true}
      pagination={false}
      rowKey="key"
      rowSelection={{
        selectedRowKeys: selectedKeys,
        onChange: (selectedKeys: string[] | number[]) => {
          if (typeof onSelectionChange === 'function') {
            onSelectionChange(selectedKeys);
          }
        },
      }}
    >
      <Column key="origin" title="Origin" dataIndex="origin" />
      <Column key="target" title="Target" dataIndex="target" />
      <Column
        key="pathrewrite"
        title="Path Rewrites"
        dataIndex="pathRewrites"
        render={(value: PathRewrite[]) => {
          if (value.length > 0) {
            return (
              <div className={s.pathRewriteRow}>
                {value.map(item => (
                  <div key={item.oldPath}>
                    {item.oldPath} -&gt; {item.newPath}
                  </div>
                ))}
              </div>
            );
          } else {
            return <div className={s.pathRewriteRow}>No path rewrite configed</div>;
          }
        }}
      />
      <Column
        key="action"
        title="Action"
        dataIndex="key"
        render={(value: string) => {
          return (
            <Icon
              type="delete"
              onClick={() => {
                if (typeof onDelete === 'function') {
                  Modal.confirm({
                    title: 'Confirm',
                    content: 'Do you want to remove this proxy configuration?',
                    onOk: () => {
                      onDelete(value);
                    },
                  });
                }
              }}
            />
          );
        }}
      />
    </Table>
  );
}
