import React, { useState } from 'react';
import { Button, Form, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import PathRewriteFormModal from './PathRewriteFormModal';
import { PathRewrite, ProxySettings } from '../types/types';

import s from './less/popup.less';

interface Props
  extends FormComponentProps<{
    origin: string;
    target: string;
  }> {
  onAdd?: (proxySettings: ProxySettings) => void | boolean;
}

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};
const formActionItemLayout = {
  wrapperCol: {
    span: 20,
    offset: 4,
  },
};

function ProjectForm({ form, onAdd }: Props) {
  const { getFieldDecorator, validateFields, setFieldsValue } = form;
  const [pathRewrites, setPathRewrites] = useState<PathRewrite[]>([]);

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <div>
      <PathRewriteFormModal
        visible={modalVisible}
        onOk={(pathRewrite: PathRewrite) => {
          if (!pathRewrites.some(w => w.oldPath === pathRewrite.oldPath)) {
            setPathRewrites([pathRewrite, ...pathRewrites]);
            setModalVisible(false);
            return true;
          }
        }}
        onCancel={() => {
          setModalVisible(false);
        }}
      />
      <Form layout="horizontal">
        <Form.Item {...formItemLayout} label="Origin">
          {getFieldDecorator('origin', {
            rules: [
              {
                required: true,
                message: 'Please input origin url',
              },
              {
                type: 'url',
                message: 'Please input a valid url',
              },
            ],
          })(<Input placeholder="Origin url" />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="Target">
          {getFieldDecorator('target', {
            rules: [
              {
                required: true,
                message: 'Please input target url',
              },
              {
                type: 'url',
                message: 'Please input a valid url',
              },
            ],
          })(<Input placeholder="Target url" />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="Path Rewrites">
          <Button
            type="default"
            onClick={() => {
              setModalVisible(true);
              return true;
            }}
          >
            Add Path Rewrite
          </Button>
          {pathRewrites.map(item => (
            <div className={s.pathRewriteRow} key={item.oldPath}>
              {item.oldPath} -&gt; {item.newPath}
            </div>
          ))}
        </Form.Item>
        <Form.Item {...formActionItemLayout}>
          <Button
            onClick={() => {
              validateFields(
                ['origin', 'target'],
                (errors, values: { origin: string; target: string }) => {
                  if (!errors) {
                    const { origin, target } = values;
                    const proxy: ProxySettings = {
                      key: `${origin}|||${target}`,
                      origin,
                      target,
                      pathRewrites,
                    };
                    if (typeof onAdd === 'function') {
                      if (onAdd(proxy)) {
                        setFieldsValue({
                          origin: '',
                          target: '',
                        });
                        setPathRewrites([]);
                      }
                    }
                  }
                },
              );
            }}
            type="primary"
          >
            Add
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Form.create<Props>({
  name: 'project form',
})(ProjectForm);
