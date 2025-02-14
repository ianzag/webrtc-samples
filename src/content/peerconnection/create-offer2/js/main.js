/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

'use strict';

const iceTransportPolicies = ['all', 'relay'];
const bundlePolicies = ['balanced', 'max-compat', 'max-bundle'];

const iceTransportPolicySelector = document.getElementById('iceTransportPolicy');
const bundlePolicySelector = document.getElementById('bundlePolicy');
const audioInput = document.querySelector('input#audio');
const restartInput = document.querySelector('input#restart');
const vadInput = document.querySelector('input#vad');
const videoInput = document.querySelector('input#video');

const outputTextarea = document.querySelector('textarea#output');
const createOfferButton = document.querySelector('button#createOffer');

createOfferButton.addEventListener('click', createOffer);

iceTransportPolicies.forEach(policyName =>
{
  const option = document.createElement('option');
  option.value = policyName;
  option.innerText = policyName;
  iceTransportPolicySelector.appendChild(option);
});

bundlePolicies.forEach(policyName =>
{
  const option = document.createElement('option');
  option.value = policyName;
  option.innerText = policyName;
  bundlePolicySelector.appendChild(option);
});

async function createOffer()
{
  outputTextarea.value = '';

  const pcConfig = 
  {
    iceTransportPolicy: iceTransportPolicySelector.options[iceTransportPolicySelector.selectedIndex].value,
    bundlePolicy: bundlePolicySelector.options[bundlePolicySelector.selectedIndex].value,
  };
  const pc = window.peerConnection = new RTCPeerConnection(pcConfig);

  try
  {
    if (audioInput.checked)
    {
      const tr1 = pc.addTransceiver("audio", {direction: "recvonly"});
      console.log("Add audio transceiver", tr1);
    }
    if (videoInput.checked)
    {
      const tr1 = pc.addTransceiver("video", {direction: "recvonly"});
      console.log("Add video transceiver", tr1);
    }

    const offerOptions =
    {
      iceRestart: restartInput.checked,
      voiceActivityDetection: vadInput.checked
    };
    const offer = await pc.createOffer(offerOptions);
    await pc.setLocalDescription(offer);

    const config = pc.getConfiguration();
    const text =
      `ICE transport policy: ${config.iceTransportPolicy}\n` + 
      `Bundle policy: ${config.bundlePolicy}\n` +
      `RTCP mux policy: ${config.rtcpMuxPolicy}\n` +
      `SDP Offer: ${offer.sdp}\n`;
    outputTextarea.value = text;
  }
  catch (e)
  {
    outputTextarea.value = `Failed to create offer: ${e}`;
  }
}
