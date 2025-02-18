/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

'use strict';

const outputTextarea = document.querySelector('textarea#output');
const getCapabilitiesButton = document.querySelector('button#getCapabilities');

getCapabilitiesButton.addEventListener('click', getCapabilities);
outputTextarea.value = "";

function printCapabilities(caps)
{
  let text = "";
  for (let i = 0; i < caps.codecs.length; ++i)
  {
    const codec = caps.codecs[i];
    text += `  codec: mimeType: '${codec.mimeType}', clockRate: ${codec.clockRate}`;
    if (codec.channels)
    {
      text += `, channels: ${codec.channels}`;
    }
    if (codec.sdpFmtpLine)
    {
      text += `, sdpFmtpLine: '${codec.sdpFmtpLine}'`;
    }
    text += "\n";
  }
  for (let i = 0; i < caps.headerExtensions.length; ++i)
  {
    const ext = caps.headerExtensions[i];
    text += `  ext: uri: '${ext.uri}'\n`;
  }
  return text;
}

async function getCapabilities()
{
  outputTextarea.value = '';

  try {
    let text = "";
    const senderAudioCaps = RTCRtpSender.getCapabilities("audio");
    if (senderAudioCaps)
    {
      text += "RTCRtpSender Audio capabilities:\n" + printCapabilities(senderAudioCaps) + "\n";
    }
    const senderVideoCaps = RTCRtpSender.getCapabilities("video");
    if (senderVideoCaps)
    {
      text += "RTCRtpSender Video capabilities:\n" + printCapabilities(senderVideoCaps) + "\n";
    }
    const receiverAudioCaps = RTCRtpReceiver.getCapabilities("audio");
    if (receiverAudioCaps)
    {
      text += "RTCRtpReceiver Audio capabilities:\n" + printCapabilities(receiverAudioCaps) + "\n";
    }
    const receiverVideoCaps = RTCRtpReceiver.getCapabilities("video");
    if (receiverVideoCaps)
    {
      text += "RTCRtpReceiver Video capabilities:\n" + printCapabilities(receiverVideoCaps) + "\n";
    }
    outputTextarea.value = text;
  } catch (e) {
    outputTextarea.value = `Failed to get capabilities: ${e}`;
  }
}
