import React from 'react';
import ProxyForm from './ProxyForm';
import ProxyListTable from './ProxyListTable';

import s from './less/popup.less';
import { ProxySettings, ModalsObject } from '../../types/types';
import { getFromStorage, saveToStorage } from '../../utils/storage';
import { StorageState } from '../../types/types';
import { KEY_STORAGE_PROXIES, KEY_STORAGE_SELECTED_PROXIES } from './constant';

interface Props {}

interface State {
  proxies: ProxySettings[];
  selectedProxies: string[] | number[];
}
export default class ProxyPane extends React.Component<Props, State> {
  public state: State;
  constructor(props: Props) {
    super(props);
    this.state = {
      proxies: [],
      selectedProxies: [],
    };
  }
  componentDidMount() {
    getFromStorage<StorageState>().then(items => {
      const proxiesObject = items[KEY_STORAGE_PROXIES] || {};
      const keys = Object.keys(proxiesObject);
      this.setState({
        proxies: keys.map(key => proxiesObject[key]),
        selectedProxies: items[KEY_STORAGE_SELECTED_PROXIES] || [],
      });
    });
  }
  saveProxies() {
    const { proxies } = this.state;
    const proxiesObject = proxies.reduce(
      (prev: ModalsObject<ProxySettings>, current: ProxySettings) => {
        prev[current.key] = current;
        return prev;
      },
      {},
    );
    saveToStorage({
      [KEY_STORAGE_PROXIES]: proxiesObject,
    });
  }

  saveSelectedProxies() {
    const { selectedProxies } = this.state;
    saveToStorage({
      [KEY_STORAGE_SELECTED_PROXIES]: selectedProxies,
    });
  }
  render() {
    const { proxies, selectedProxies } = this.state;
    return (
      <div className={s.paneContainer}>
        <ProxyForm
          onAdd={(proxy: ProxySettings) => {
            if (!proxies.some(p => p.key === proxy.key)) {
              const newProxies = [proxy, ...proxies];
              this.setState({ proxies: newProxies }, () => {
                this.saveProxies();
              });
              return true;
            }
          }}
        />
        <ProxyListTable
          proxies={proxies}
          onDelete={(key: string) => {
            const newProxies = proxies.reduce((prev: ProxySettings[], current: ProxySettings) => {
              if (current.key !== key) {
                prev.push(current);
              }
              return prev;
            }, []);
            this.setState({ proxies: newProxies }, () => {
              this.saveProxies();
            });
          }}
          onSelectionChange={(selectedKeys: string[] | number[]) => {
            this.setState({ selectedProxies: selectedKeys }, () => {
              this.saveSelectedProxies();
            });
          }}
          selectedKeys={selectedProxies}
        />
      </div>
    );
  }
}
