import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import { Project } from '../types/types';
import { fetchProjects } from './requests';
import { URL_DEFAULT_PLATFORM, URL_DEFAULT_ORIGIN } from './constant';

interface Props
  extends FormComponentProps<{
    origin: string;
    platform: string;
    projectId: number;
  }> {
  onAdd?: (urlOrigin: string, urlPlatformAddress: string, project: Project) => void | boolean;
}

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};
const formActionItemLayout = {
  wrapperCol: {
    span: 18,
    push: 6,
  },
};

function ProjectForm({ form, onAdd }: Props) {
  const { getFieldDecorator, getFieldValue, getFieldError, validateFields } = form;
  const [projects, setProjects] = useState<Project[]>([]);
  const [urlPlatformAddress, setUrlPlatformAddress] = useState<string>(URL_DEFAULT_PLATFORM);
  const [urlOrigin, setUrlOrigin] = useState(URL_DEFAULT_ORIGIN);
  const showProjectOptions = projects && projects.length > 0;
  useEffect(() => {
    console.log('Platform Address:', urlPlatformAddress);
    try {
      fetchProjects(urlPlatformAddress).then(res => {
        const projects = res.data.items;
        setProjects(projects);
      });
    } catch (ex) {
      console.error(ex);
    }
  }, [urlPlatformAddress]);
  return (
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
          initialValue: urlOrigin,
        })(
          <Input
            onBlur={() => {
              if (!getFieldError('origin')) {
                const newUrlOrigin = getFieldValue('origin');
                setUrlOrigin(newUrlOrigin);
              }
            }}
            placeholder="Address of platform"
          />,
        )}
      </Form.Item>
      <Form.Item {...formItemLayout} label="Plafform Address">
        {getFieldDecorator('platform', {
          rules: [
            {
              required: true,
              message: 'Please input address of platform',
            },
            {
              type: 'url',
              message: 'Please input a valid url',
            },
          ],
          initialValue: urlPlatformAddress,
        })(
          <Input
            onBlur={async () => {
              console.log(getFieldValue('platform'));
              console.log(getFieldError('platform'));
              if (!getFieldError('platform')) {
                try {
                  const platform = getFieldValue('platform');
                  setUrlPlatformAddress(platform);
                } catch (ex) {
                  console.error(ex);
                }
              }
            }}
            placeholder="Address of platform"
          />,
        )}
      </Form.Item>
      <Form.Item {...formItemLayout} label="Project">
        {getFieldDecorator('projectId', {
          rules: [
            {
              required: true,
              message: 'Please select project',
            },
          ],
        })(
          <Select disabled={!showProjectOptions} placeholder="Selected a project">
            {showProjectOptions &&
              projects.map((item: Project) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.namespace}({item.name})
                </Select.Option>
              ))}
          </Select>,
        )}
      </Form.Item>
      <Form.Item {...formActionItemLayout}>
        <Button
          type="primary"
          onClick={() => {
            validateFields((errors, values) => {
              if (!errors) {
                const { origin, platform, projectId } = values;
                const project = projects.find(item => item.id === projectId);
                if (project && typeof onAdd === 'function') {
                  onAdd(origin, platform, project);
                }
              }
            });
          }}
        >
          Add
        </Button>
      </Form.Item>
    </Form>
  );
}

export default Form.create<Props>({
  name: 'project form',
})(ProjectForm);
