import React from 'react';
import { Button, Form, Input, Modal } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import { PathRewrite } from '../../types/types';

import s from './less/popup.less';

interface PathRewriteModalProps
  extends FormComponentProps<{
    oldPath: string;
    newPath: string;
  }> {
  onOk?: (pathRewrite: PathRewrite) => void | boolean;
  onCancel?: () => void;
  visible: boolean;
}
const innerFormItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const innerFormActionItemLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const regPathname = /^\/[^\s/]*(\/[^\s/]+)*$/;

class PathRewriteFormModal extends React.Component<PathRewriteModalProps> {
  render() {
    const { form, onCancel, onOk, visible } = this.props;
    const { getFieldDecorator, validateFields, setFieldsValue } = form;
    return (
      <Modal closable={false} title="Add Path Rewrite" footer={null} visible={visible}>
        <Form>
          <Form.Item {...innerFormItemLayout} label="Old path">
            {getFieldDecorator('oldPath', {
              rules: [
                {
                  required: true,
                  message: 'Please Input old path',
                },
                {
                  pattern: regPathname,
                  message: 'Invalid pathname',
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item {...innerFormItemLayout} label="New path">
            {getFieldDecorator('newPath', {
              rules: [
                {
                  required: true,
                  message: 'Please Input new path',
                },
                {
                  pattern: regPathname,
                  message: 'Invalid pathname',
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item {...innerFormActionItemLayout}>
            <Button
              type="primary"
              className={s.mr16}
              onClick={() => {
                validateFields(['newPath', 'oldPath'], (errors, values) => {
                  const { oldPath, newPath } = values;
                  if (!errors && typeof onOk === 'function') {
                    if (
                      onOk({
                        oldPath,
                        newPath,
                      })
                    ) {
                      setFieldsValue({
                        oldPath: '',
                        newPath: '',
                      });
                    }
                  }
                });
              }}
            >
              Add
            </Button>
            <Button
              type="default"
              onClick={() => {
                if (typeof onCancel === 'function') {
                  onCancel();
                }
              }}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create<PathRewriteModalProps>({
  name: 'path-rewrite-form-modal',
})(PathRewriteFormModal);
