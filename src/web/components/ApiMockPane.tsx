import React from 'react';
import ProjectForm from './ProjectForm';
import ApiListTable from './ApiListTable';

import s from './less/popup.less';
import { Project, Api, ModalsObject, StorageState, MockProject } from '../../types/types';
import { message } from 'antd';
import { getFromStorage, saveToStorage } from '../../utils/storage';
import { KEY_STORAGE_SELECTED_APIS, KEY_STORAGE_PROJECTS } from './constant';

const divider = '|||';

const getKey = (origin: string, platform: string, project: Project) =>
  `${origin}${divider}${platform}${divider}${project.namespace}`;

interface Props {}
interface State {
  projects: ModalsObject<MockProject>;
  selectedApis: ModalsObject<Api[]>;
}

export default class ProxyPane extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      projects: {},
      selectedApis: {},
    };
  }
  componentDidMount() {
    getFromStorage<StorageState>().then(items => {
      this.setState({
        projects: items[KEY_STORAGE_PROJECTS] || {},
        selectedApis: items[KEY_STORAGE_SELECTED_APIS] || {},
      });
    });
  }

  renderApiTable(key: string) {
    const { projects, selectedApis } = this.state;
    const project = projects[key];
    if (project) {
      const [origin, platform] = key.split(divider);
      const currentSelectedApis = selectedApis[key] || [];
      const selectedRowKeys = currentSelectedApis.map(i => i.id);
      return (
        <ApiListTable
          key={key}
          origin={origin}
          platform={platform}
          project={project.project}
          selectedRowKeys={selectedRowKeys}
          onDelete={(origin: string, platform: string, project: Project) => {
            const key = getKey(origin, platform, project);
            delete projects[key];
            delete selectedApis[key];
            this.setState({
              projects: { ...projects },
              selectedApis: { ...selectedApis },
            });
            saveToStorage({
              [KEY_STORAGE_PROJECTS]: projects,
              [KEY_STORAGE_SELECTED_APIS]: selectedApis,
            });
          }}
          onApiSelectionChange={(
            origin: string,
            platform: string,
            project: Project,
            currentSelectedApis: Api[],
          ) => {
            const currentKey = getKey(origin, platform, project);
            const newSelectedApis = {
              ...selectedApis,
              [currentKey]: [...currentSelectedApis],
            };
            this.setState({
              selectedApis: newSelectedApis,
              projects: { ...projects },
            });
            saveToStorage({
              [KEY_STORAGE_SELECTED_APIS]: newSelectedApis,
            });
          }}
        />
      );
    }
  }
  render() {
    const { projects } = this.state;

    const keys = Object.keys(projects);

    return (
      <div className={s.paneContainer}>
        <ProjectForm
          onAdd={(origin: string, platform: string, project: Project) => {
            const key = getKey(origin, platform, project);
            if (projects[key]) {
              message.error('Same mock settings already added', 3);
            } else {
              const newProjects = {
                ...projects,
                [key]: { origin, platform, project },
              };
              this.setState({ projects: newProjects });
              saveToStorage({ [KEY_STORAGE_PROJECTS]: newProjects }).then(() => {
                message.success('Project added successfully', 2);
              });
            }
          }}
        />

        {keys.map((key: string) => this.renderApiTable(key))}
      </div>
    );
  }
}
