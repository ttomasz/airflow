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

import React from 'react';
import { Button, Link } from '@chakra-ui/react';

import { getMetaValue } from '../utils';

const dagId = getMetaValue('dag_id');
const numRuns = getMetaValue('num_runs');
const urlRoot = getMetaValue('root');
const baseDate = getMetaValue('base_date');

const ResetRoot = () => {
  let rootLink;
  if (urlRoot) {
    const params = new URLSearchParams();
    if (numRuns) params.set('num_runs', numRuns);
    if (baseDate) params.set('base_date', baseDate);
    rootLink = `/dags/${dagId}/grid?${params.toString()}`;
  }

  if (!rootLink) return null;

  return (
    <Button
      as={Link}
      variant="outline"
      href={rootLink}
      colorScheme="blue"
      mr={2}
      title="Reset root to show the whole DAG"
    >
      Reset Root
    </Button>
  );
};

export default ResetRoot;
