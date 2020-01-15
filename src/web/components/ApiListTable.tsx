import React from 'react';
import s from './less/popup.less';
import { Modal, Table, Button } from 'antd';
import { Api, HttpResponse } from '../types/types';
import { fetchApis } from './requests';
import { Project } from '../types/types';

const { Column } = Table;
interface Props {
  origin: string;
  platform: string;
  project: Project;
  selectedRowKeys: string[] | number[];
  onApiSelectionChange?: (
    origin: string,
    platform: string,
    project: Project,
    selectedApis: Api[],
  ) => void;
  onDelete?: (origin: string, platform: string, project: Project) => void;
}

interface State {
  apis: Api[];
  loading: boolean;
}

export default class ApiListTable extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      apis: [],
      loading: false,
    };
  }

  componentDidMount() {
    const { platform, project } = this.props;
    this.setState({ loading: true });
    fetchApis(platform, project.id).then((res: HttpResponse<Api[]>) => {
      const { data } = res;
      try {
        this.setState({
          apis: data.map(api => {
            return { ...api, key: api.id };
          }),
          loading: false,
        });
      } catch (ex) {
        console.log(ex);
      }
    });
  }

  componentDidUpdate() {
    console.log('Component updated');
  }

  render() {
    const {
      origin,
      platform,
      project,
      selectedRowKeys,
      onApiSelectionChange,
      onDelete,
    } = this.props;
    const { apis, loading } = this.state;
    if (!apis || apis.length < 1) {
      return null;
    }

    return (
      <Table
        rowKey="id"
        dataSource={apis}
        bordered={true}
        pagination={false}
        loading={loading}
        className={s.mb16}
        rowSelection={{
          selectedRowKeys,
          onChange: (selectedRowKeys: number[] | string[], selectedApis: Api[]) => {
            if (typeof onApiSelectionChange === 'function') {
              onApiSelectionChange(origin, platform, project, selectedApis);
            }
          },
        }}
        title={() => {
          return (
            <div className={s.projectInfo}>
              <div className={s.item}>
                <div className={s.label}>Origin:</div>
                <div className={s.value}>{origin}</div>
              </div>
              <div className={s.item}>
                <div className={s.label}>Platform:</div>
                <div className={s.value}>{platform}</div>
              </div>
              <div className={s.item}>
                <div className={s.label}>Project:</div>
                <div className={s.value}>{`${project.namespace}(${project.name})`}</div>
              </div>
              <div className={s.actions}>
                <Button
                  type="danger"
                  icon="delete"
                  size="small"
                  onClick={() => {
                    if (typeof onDelete === 'function') {
                      Modal.confirm({
                        title: 'Confirm',
                        content: 'Do you want to remove this project config?',
                        onOk: () => {
                          onDelete(origin, platform, project);
                        },
                      });
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          );
        }}
      >
        <Column key="id" title="Id" dataIndex="id" />
        <Column key="pathname" title="Pathname" dataIndex="pathname" />
        <Column key="method" title="Method" dataIndex="method" />
        <Column key="name" title="Name" dataIndex="name" />
      </Table>
    );
  }
}
