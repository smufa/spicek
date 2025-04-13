import { Injectable } from '@nestjs/common';
import {
  PoseFrameDto,
  NormalizedLandmarkDto,
} from 'src/session/dto/add-session-data.dto';
import { BadPostureEvent } from './posture.dto';

@Injectable()
export class PostureService {
  public analyzeBadPostureEvents(
    poseFrames: PoseFrameDto[],
  ): BadPostureEvent[] {
    const events: BadPostureEvent[] = [];
    const activeIssues: Record<string, BadPostureEvent | null> = {};

    for (const frame of poseFrames) {
      const { timestamp, landmarks } = frame;

      if (landmarks.length < 33) continue;

      const issues = this.detectIssues(landmarks);

      const allIssueTypes = [
        'Slouching',
        'Arms Crossed',
        'Hands Too Low',
        'Looking Down',
        'Leaning Sideways',
      ];

      for (const issueType of allIssueTypes) {
        const isBad = issues.includes(issueType);
        const active = activeIssues[issueType];

        if (isBad && !active) {
          // Start new event
          activeIssues[issueType] = {
            startTime: timestamp,
            endTime: timestamp,
            issue: issueType,
          };
        } else if (isBad && active) {
          // Extend ongoing event
          active.endTime = timestamp;
        } else if (!isBad && active) {
          // End event
          events.push({ ...active });
          activeIssues[issueType] = null;
        }
      }
    }

    // Add any lingering open events
    for (const issueType in activeIssues) {
      const active = activeIssues[issueType];
      if (active) events.push(active);
    }

    // go through all events and remov all that are less than 20ms
    for (let i = events.length - 1; i >= 0; i--) {
      const event = events[i];
      if (event.endTime - event.startTime < 200) {
        events.splice(i, 1);
      }
    }

    return events;
  }

  private detectIssues(landmarks: NormalizedLandmarkDto[]): string[] {
    const issues: string[] = [];

    const [
      nose,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      leftEye,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      rightEye,
      leftShoulder,
      rightShoulder,
      leftElbow,
      rightElbow,
      leftWrist,
      rightWrist,
      leftHip,
      rightHip,
    ] = [
      landmarks[0],
      landmarks[2],
      landmarks[5],
      landmarks[11],
      landmarks[12],
      landmarks[13],
      landmarks[14],
      landmarks[15],
      landmarks[16],
      landmarks[23],
      landmarks[24],
    ];

    // Helper
    const distance = (a: NormalizedLandmarkDto, b: NormalizedLandmarkDto) =>
      Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

    // Slouching
    const dx =
      (leftShoulder.x + rightShoulder.x) / 2 - (leftHip.x + rightHip.x) / 2;
    const dy =
      (leftShoulder.y + rightShoulder.y) / 2 - (leftHip.y + rightHip.y) / 2;
    const backAngle = Math.atan2(dy, dx) * (180 / Math.PI);
    if (Math.abs(backAngle - 90) > 20) issues.push('Slouching');

    // Arms Crossed
    const crossed =
      distance(leftWrist, rightElbow) < 0.15 &&
      distance(rightWrist, leftElbow) < 0.15;
    if (crossed) issues.push('Arms Crossed');

    // Hands too low
    const avgHipY = (leftHip.y + rightHip.y) / 2;
    if (leftWrist.y > avgHipY && rightWrist.y > avgHipY)
      issues.push('Hands Too Low');

    // Looking Down
    const avgShoulderY = (leftShoulder.y + rightShoulder.y) / 2;
    if (nose.y > avgShoulderY) issues.push('Looking Down');

    // Leaning Sideways
    if (Math.abs(leftShoulder.y - rightShoulder.y) > 0.1)
      issues.push('Leaning Sideways');

    return issues;
  }
}
