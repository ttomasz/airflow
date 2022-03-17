/*!
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { useState } from 'react';
import {
  Button,
  Flex,
  ButtonGroup,
  useDisclosure,
} from '@chakra-ui/react';

import ActionButton from './ActionButton';
import { useConfirmMarkTask, useMarkFailedTask } from '../../../../api';
import ConfirmDialog from '../../ConfirmDialog';

const MarkFailed = ({
  dagId,
  runId,
  taskId,
}) => {
  const [affectedTasks, setAffectedTasks] = useState([]);

  // Options check/unchecked
  const { isOpen: past, onToggle: onTogglePast } = useDisclosure();
  const { isOpen: future, onToggle: onToggleFuture } = useDisclosure();
  const { isOpen: upstream, onToggle: onToggleUpstream } = useDisclosure();
  const { isOpen: downstream, onToggle: onToggleDownstream } = useDisclosure();

  // Confirm dialog open/close
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { mutateAsync: markFailedMutation, isLoading: isMarkLoading } = useMarkFailedTask({
    dagId, runId, taskId,
  });
  const {
    mutateAsync: confirmChangeMutation, isLoading: isConfirmLoading,
  } = useConfirmMarkTask({
    dagId, runId, taskId, state: 'failed',
  });

  const onClick = async () => {
    try {
      const data = await confirmChangeMutation({
        past,
        future,
        upstream,
        downstream,
      });
      setAffectedTasks(data);
      onOpen();
    } catch (e) {
      console.log(e);
    }
  };

  const onConfirm = async () => {
    try {
      await markFailedMutation({
        past,
        future,
        upstream,
        downstream,
      });
      setAffectedTasks([]);
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Flex justifyContent="space-between" width="100%">
      <ButtonGroup isAttached variant="outline">
        <ActionButton bg={past && 'gray.100'} onClick={onTogglePast} name="Past" />
        <ActionButton bg={future && 'gray.100'} onClick={onToggleFuture} name="Future" />
        <ActionButton bg={upstream && 'gray.100'} onClick={onToggleUpstream} name="Upstream" />
        <ActionButton bg={downstream && 'gray.100'} onClick={onToggleDownstream} name="Downstream" />
      </ButtonGroup>
      <Button colorScheme="red" onClick={onClick} isLoading={isMarkLoading || isConfirmLoading}>
        Mark Failed
      </Button>
      <ConfirmDialog
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={onConfirm}
        title="Mark Tasks as Failed"
        body={affectedTasks}
      />
    </Flex>
  );
};

export default MarkFailed;
