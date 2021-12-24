/**
 * Created by chencheng on 17-8-31.
 */
import MenuPermission from './MenuPermission';
import DataPermission from './DataPermission';

import { PureComponent } from 'react';
import { Tabs } from 'antd';
import { MainHeader, MainContent } from 'templates/MainLayout';

export default class Permission extends PureComponent {

    render() {
        return (
            <div>
                <MainHeader title="权限分配" />

                <MainContent>
                    <Tabs type="card">
                        <Tabs.TabPane tab="栏目权限" key="1">
                            <MenuPermission />
                        </Tabs.TabPane>
                        {/*<Tabs.TabPane tab="数据权限" key="2">*/}
                            {/*<DataPermission />*/}
                        {/*</Tabs.TabPane>*/}
                    </Tabs>
                </MainContent>
            </div>
        );
    }
}
