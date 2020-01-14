import React from 'react';
import ReactDOM from 'react-dom';
import s from './less/popup.less';
import { Tabs } from 'antd';
import ProxyPane from './ProxyPane';
import ApiMockPane from './ApiMockPane';
const { TabPane } = Tabs;
function App() {
  return (
    <Tabs destroyInactiveTabPane={false} className={s.container} tabPosition="top">
      <TabPane tab="Api Mocks" key="mock">
        <ApiMockPane />
      </TabPane>
      <TabPane tab="Extra Proxies" key="extra-proxies">
        <ProxyPane />
      </TabPane>
    </Tabs>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
