import React from 'react';
import _ from 'lodash';
import { Button, notification } from 'antd';

export default function cmdSuccessNotification(args, showCmdDialog) {
  // const { args } = this.props.rekitCmds.execCmdResult;
  const notificationKey = 'cmd_success';

  const btnClick = () => {
    notification.close(notificationKey);
    showCmdDialog('logViewer');
  };

  notification.success({
    duration: 3,
    message: `${_.upperFirst(args.commandName)} ${args.type} success.`,
    description: 'Click see logs button to see what has been done.',
    key: notificationKey,
    btn: <Button type="primary" onClick={btnClick}>See logs</Button>,
  });
}
