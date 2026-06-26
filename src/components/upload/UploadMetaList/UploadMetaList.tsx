import React from 'react';
import {View} from 'react-native';
import {DataRow} from '../../common/DataRow/DataRow';
import {styles} from './UploadMetaListStyle';

interface UploadMetaListProps {
  userId: string;
  consentTimestamp: string;
  consentVersion: string;
  captureTimestamp: string;
  deviceModel: string;
  destination: string;
}

export function UploadMetaList({
  userId,
  consentTimestamp,
  consentVersion,
  captureTimestamp,
  deviceModel,
  destination,
}: UploadMetaListProps) {
  return (
    <View style={styles.metadata}>
      <DataRow label="User" value={userId} />
      <DataRow label="Consent timestamp" value={consentTimestamp} />
      <DataRow label="Consent version" value={consentVersion} />
      <DataRow label="Captured at" value={captureTimestamp} />
      <DataRow label="Device" value={deviceModel} />
      <DataRow label="Destination" value={destination} />
    </View>
  );
}
