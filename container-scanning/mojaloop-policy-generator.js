#!/usr/bin/env node

const fs = require('fs')

/**
 * This file generates an anchore-cli compatible policy.json file.
 * 
 * usage: 
 *    ./mojaloop-policy-generator.js <full path of desired output file>
 * 
 * for example:
 *    ./mojaloop-policy-generator.js /tmp/mojaloop-policy.json
 * 
 * We keep this in a .js file as it allows us to better manage the complicated policy file with comments, etc 
 * 
 * 
 *  Tips for writing a valid file (anchore has no easy policy checker, so if this 
 *  file is written incorrectly, it will simply fail and default to the default
 *  policy file
 * 
 *  1. The top level `mappings.policy_ids` and `mappings.whitelist_ids` are important, 
 *     they must match the ids in the respective `policies` and `whitelists` map
 *  2. You must have AT LEAST ONE policy in the policies map
 *  3. There is no lower limit to the whitelists
 */

if (process.argv.length !== 3) {
  console.warn(`Usage: ./mojaloop-policy.js <full path of desired output file>`)
  process.exit(1)
}

const outputPath = process.argv[2]
console.log(`Exporting policy path: ${outputPath}`)

/**
 * Edit the policy inline here.
 * Based off of the Docker CIS 1.13.0 best practices
 */
const policy = {
  id: 'mojaloop-default',
  name: "mojaloop-default",
  version: "1_0",
  description: "Mojaloop default Anchore policy, based on the Docker CIS 1.13.0 image content checks.",
  last_updated: Math.floor((new Date()).getTime()/1000),
  blacklisted_images: [],
  mappings: [
    {
      "comment": "default mapping that matches all registry/repo:tag images",
      "id": "042d5b75-ed9d-4fb7-8d41-ec174102f696",
      "image": {
        "type": "tag",
        "value": "*"
      },
      "name": "default",
      "policy_ids": [
        // "4f3bdc23-175b-4582-8c7d-3a7d8fa32a12",
        // "cb417967-266b-4453-bfb6-9acf67b0bee5",
        "f2de1d56-c7f1-4b5a-92e0-135a27feae45"
      ],
      "registry": "*",
      "repository": "*",
      "whitelist_ids": [
        // "13f4c9fe-e86c-4b07-94fd-57fd086f1ff6",
        // "add5d172-775c-461a-842e-41c87af671dc"
      ]
    }
  ],
  policies: [
    {
      comment: "Docker CIS section 4.8 and 4.10 checks.",
      id: "f2de1d56-c7f1-4b5a-92e0-135a27feae45",
      name: "CIS File Checks",
      rules: [
        {
          "action": "WARN",
          "comment": "section 4.8",
          "gate": "files",
          "id": "41b657bb-86e5-43ba-8f35-18edc3a465f9",
          "params": [],
          "trigger": "suid_or_guid_set"
        },
        {
          "action": "WARN",
          "comment": "section 4.10",
          "gate": "secret_scans",
          "id": "c0e5e302-764d-4b19-9fbd-5c7b0b558673",
          "params": [],
          "trigger": "content_regex_checks"
        }
      ],
      version: "1_0"
    },
    // TODO: uncomment this section
    // {
    //   "comment": "Docker CIS section 4.1, 4.2, 4.6, 4.7, 4.9 and 5.8 checks.",
    //   "id": "cb417967-266b-4453-bfb6-9acf67b0bee5",
    //   "name": "CIS Dockerfile Checks",
    //   "rules": [
    //     {
    //       "action": "STOP",
    //       "comment": "section 5.8. example for allowing only whitelisted exposed ports 12345, 23456",
    //       "gate": "dockerfile",
    //       "id": "ef85285b-801b-48a4-b130-3a35e2d58133",
    //       "params": [
    //         {
    //           "name": "ports",
    //           "value": "12345,23456"
    //         },
    //         {
    //           "name": "type",
    //           "value": "whitelist"
    //         }
    //       ],
    //       "trigger": "exposed_ports"
    //     },
    //     {
    //       "action": "WARN",
    //       "comment": "section",
    //       "gate": "dockerfile",
    //       "id": "e9eacc50-aaac-4241-95ac-790cf0be84da",
    //       "params": [
    //         {
    //           "name": "instruction",
    //           "value": "ADD"
    //         },
    //         {
    //           "name": "check",
    //           "value": "exists"
    //         }
    //       ],
    //       "trigger": "instruction"
    //     },
    //     {
    //       "action": "WARN",
    //       "comment": "section 4.7",
    //       "gate": "dockerfile",
    //       "id": "2f87d4bf-e963-496a-8b3d-ff90bef46014",
    //       "params": [
    //         {
    //           "name": "instruction",
    //           "value": "RUN"
    //         },
    //         {
    //           "name": "check",
    //           "value": "like"
    //         },
    //         {
    //           "name": "value",
    //           "value": "(\\s*/bin/sh\\s*-c\\s*)*\\s*apk.*up(date|grade)\\s*$"
    //         }
    //       ],
    //       "trigger": "instruction"
    //     },
    //     {
    //       "action": "WARN",
    //       "comment": "section 4.7",
    //       "gate": "dockerfile",
    //       "id": "ea1b1c11-0633-48cc-8afc-92b252f331b3",
    //       "params": [
    //         {
    //           "name": "instruction",
    //           "value": "RUN"
    //         },
    //         {
    //           "name": "check",
    //           "value": "like"
    //         },
    //         {
    //           "name": "value",
    //           "value": "(\\s*/bin/sh\\s*-c\\s*)*\\s*yum.*up(date|grade)\\s*$"
    //         }
    //       ],
    //       "trigger": "instruction"
    //     },
    //     {
    //       "action": "WARN",
    //       "comment": "section 4.7",
    //       "gate": "dockerfile",
    //       "id": "c5dbe7b8-b48b-4845-beff-069421d9d1ba",
    //       "params": [
    //         {
    //           "name": "instruction",
    //           "value": "RUN"
    //         },
    //         {
    //           "name": "check",
    //           "value": "like"
    //         },
    //         {
    //           "name": "value",
    //           "value": "(\\s*/bin/sh\\s*-c\\s*)*\\s*apt(-get)*.*up(date|grade)\\s*$"
    //         }
    //       ],
    //       "trigger": "instruction"
    //     },
    //     {
    //       "action": "STOP",
    //       "comment": "section 4.6",
    //       "gate": "dockerfile",
    //       "id": "64499886-5917-4a41-b18b-7d2d0bdcf12b",
    //       "params": [
    //         {
    //           "name": "instruction",
    //           "value": "HEALTHCHECK"
    //         },
    //         {
    //           "name": "check",
    //           "value": "not_exists"
    //         }
    //       ],
    //       "trigger": "instruction"
    //     },
    //     {
    //       "action": "STOP",
    //       "comment": "section 4.2",
    //       "gate": "dockerfile",
    //       "id": "f2b27bac-37e5-4ed2-b3f6-da7c76748b49",
    //       "params": [
    //         {
    //           "name": "instruction",
    //           "value": "FROM"
    //         },
    //         {
    //           "name": "check",
    //           "value": "not_in"
    //         },
    //         {
    //           "name": "value",
    //           "value": "example_trusted_base1,example_trusted_base2"
    //         },
    //         {
    //           "name": "actual_dockerfile_only",
    //           "value": "false"
    //         }
    //       ],
    //       "trigger": "instruction"
    //     },
    //     {
    //       "action": "STOP",
    //       "comment": "section 4.1",
    //       "gate": "dockerfile",
    //       "id": "c96bf84d-0e76-435c-a94c-0f556bbaf45f",
    //       "params": [
    //         {
    //           "name": "users",
    //           "value": "root,docker"
    //         },
    //         {
    //           "name": "type",
    //           "value": "blacklist"
    //         }
    //       ],
    //       "trigger": "effective_user"
    //     }
    //   ],
    //   "version": "1_0"
    // },
    // {
    //   "comment": "Docker CIS section 4.3 and 4.4 checks.",
    //   "id": "4f3bdc23-175b-4582-8c7d-3a7d8fa32a12",
    //   "name": "CIS Software Checks",
    //   "rules": [
    //     {
    //       "action": "WARN",
    //       "comment": "section 4.3",
    //       "gate": "packages",
    //       "id": "5991ec11-fd80-4066-ba92-96e2db98dde6",
    //       "params": [
    //         {
    //           "name": "name",
    //           "value": "example_blacklisted_package_2"
    //         },
    //         {
    //           "name": "version",
    //           "value": "1.0.0"
    //         }
    //       ],
    //       "trigger": "blacklist"
    //     },
    //     {
    //       "action": "WARN",
    //       "comment": "section 4.3",
    //       "gate": "packages",
    //       "id": "94a6cbb5-66b0-4bc7-b1dc-6293cca251a7",
    //       "params": [
    //         {
    //           "name": "name",
    //           "value": "example_blacklisted_package_1"
    //         }
    //       ],
    //       "trigger": "blacklist"
    //     },
    //     {
    //       "action": "WARN",
    //       "comment": "section 4.4",
    //       "gate": "vulnerabilities",
    //       "id": "8955f515-60e2-4483-bdf4-2fe475fe0c8c",
    //       "params": [
    //         {
    //           "name": "package_type",
    //           "value": "all"
    //         },
    //         {
    //           "name": "severity_comparison",
    //           "value": "<="
    //         },
    //         {
    //           "name": "severity",
    //           "value": "negligible"
    //         },
    //         {
    //           "name": "vendor_only",
    //           "value": "true"
    //         }
    //       ],
    //       "trigger": "package"
    //     },
    //     {
    //       "action": "STOP",
    //       "comment": "section 4.4",
    //       "gate": "vulnerabilities",
    //       "id": "0821c410-b0d4-4a25-90d7-aa71b46d7e32",
    //       "params": [
    //         {
    //           "name": "package_type",
    //           "value": "all"
    //         },
    //         {
    //           "name": "severity_comparison",
    //           "value": ">="
    //         },
    //         {
    //           "name": "severity",
    //           "value": "low"
    //         },
    //         {
    //           "name": "vendor_only",
    //           "value": "true"
    //         }
    //       ],
    //       "trigger": "package"
    //     },
    //     {
    //       "action": "STOP",
    //       "comment": "section 4.4",
    //       "gate": "vulnerabilities",
    //       "id": "211fa08b-e69a-4165-a0df-05cd3bd0e002",
    //       "params": [
    //         {
    //           "name": "package_type",
    //           "value": "all"
    //         },
    //         {
    //           "name": "severity_comparison",
    //           "value": ">="
    //         },
    //         {
    //           "name": "severity",
    //           "value": "unknown"
    //         },
    //         {
    //           "name": "fix_available",
    //           "value": "true"
    //         }
    //       ],
    //       "trigger": "package"
    //     },
    //     {
    //       "action": "STOP",
    //       "comment": "section 4.4",
    //       "gate": "vulnerabilities",
    //       "id": "e3a73079-fe16-4de6-9b2f-3982277e57d5",
    //       "params": [
    //         {
    //           "name": "max_days_since_sync",
    //           "value": "2"
    //         }
    //       ],
    //       "trigger": "stale_feed_data"
    //     },
    //     {
    //       "action": "STOP",
    //       "comment": "section 4.4",
    //       "gate": "vulnerabilities",
    //       "id": "aeff8bdb-82b5-44fd-87ef-d8fdd50893e8",
    //       "params": [],
    //       "trigger": "vulnerability_data_unavailable"
    //     }
    //   ],
    //   "version": "1_0"
    // }
  ],
  whitelisted_images: [],
  whitelists: [
    // TODO: update these for alpine images
    // {
    //   "comment": "Example whitelist with triggerIds of files that are expected to have SUID/SGID, for rhel-based images",
    //   "id": "add5d172-775c-461a-842e-41c87af671dc",
    //   "items": [
    //     {
    //       "comment": "whitelist /usr/bin/chage",
    //       "gate": "files",
    //       "id": "9b37f652-81ea-4081-9696-e4078f13c02d",
    //       "trigger_id": "639f6f1177735759703e928c14714a59"
    //     },
    //     {
    //       "comment": "whitelist /usr/bin/chfn",
    //       "gate": "files",
    //       "id": "ee1ab7ae-3f98-48a1-8cb5-1f3d69ae4b1f",
    //       "trigger_id": "ad4759bf9c3ce28f10d9d2f6eae51fa1"
    //     },
    //     {
    //       "comment": "whitelist /usr/bin/chsh",
    //       "gate": "files",
    //       "id": "8ddedb38-bcb7-495d-9c7c-45c25033f171",
    //       "trigger_id": "c67a2c13ebe88380113e7fbcb2437714"
    //     },
    //     {
    //       "comment": "whitelist /usr/bin/gpasswd",
    //       "gate": "files",
    //       "id": "7230781a-adfe-41c1-8a60-9424015b4d2f",
    //       "trigger_id": "c2e44319ae5b3b040044d8ae116d1c2f"
    //     },
    //     {
    //       "comment": "whitelist /usr/bin/mount",
    //       "gate": "files",
    //       "id": "858e8b7c-62df-49a4-8d6d-a0c13816741d",
    //       "trigger_id": "698044205a9c4a6d48b7937e66a6bf4f"
    //     },
    //     {
    //       "comment": "whitelist /usr/bin/newgrp",
    //       "gate": "files",
    //       "id": "d7cc62c6-7fd4-4034-bfaa-fa1323c0fdd2",
    //       "trigger_id": "463a9a24225c26f7a5bf3f38908e5cb3"
    //     },
    //     {
    //       "comment": "whitelist /usr/bin/passwd",
    //       "gate": "files",
    //       "id": "654c3344-1b21-4d13-a896-1acd3ffe5876",
    //       "trigger_id": "bcd159901fe47efddae5c095b4b0d7fd"
    //     },
    //     {
    //       "comment": "whitelist /usr/bin/su",
    //       "gate": "files",
    //       "id": "7593a55b-4d0c-4bf7-a0bb-678022875fd1",
    //       "trigger_id": "320a97c6816565eedf3545833df99dd0"
    //     },
    //     {
    //       "comment": "whitelist /usr/bin/umount",
    //       "gate": "files",
    //       "id": "68f0da8b-db3d-4afb-bab8-f7656dc7dd7b",
    //       "trigger_id": "e7573262736ef52353cde3bae2617782"
    //     },
    //     {
    //       "comment": "whitelist /usr/bin/write",
    //       "gate": "files",
    //       "id": "c2adc0bd-a566-4f2a-b57c-b9636e15c57e",
    //       "trigger_id": "addbb93c22e9b0988b8b40392a4538cb"
    //     },
    //     {
    //       "comment": "whitelist /usr/libexec/dbus-1/dbus-daemon-launch-helper",
    //       "gate": "files",
    //       "id": "e7c2f14b-1213-4a67-9295-2b1c3c280b02",
    //       "trigger_id": "3456a263793066e9b5063ada6e47917d"
    //     },
    //     {
    //       "comment": "whitelist /usr/libexec/utempter/utempter",
    //       "gate": "files",
    //       "id": "8f5f8ebb-04da-4c80-9663-339d04a675bf",
    //       "trigger_id": "3e5fad1c039f3ecfd1dcdc94d2f1f9a0"
    //     },
    //     {
    //       "comment": "whitelist /usr/sbin/pam_timestamp_check",
    //       "gate": "files",
    //       "id": "e50325ea-0825-421f-87bd-e3addd082b16",
    //       "trigger_id": "abb121e9621abdd452f65844954cf1c1"
    //     },
    //     {
    //       "comment": "whitelist /usr/sbin/unix_chkpwd",
    //       "gate": "files",
    //       "id": "5071e22f-ebd3-40ca-94f1-0dc6800bc33d",
    //       "trigger_id": "34de21e516c0ca50a96e5386f163f8bf"
    //     }
    //   ],
    //   "name": "RHEL SUID Files",
    //   "version": "1_0"
    // },
    // {
    //   "comment": "Example whitelist with triggerIds of files that are expected to have SUID/SGID, for debian-based images",
    //   "id": "13f4c9fe-e86c-4b07-94fd-57fd086f1ff6",
    //   "items": [
    //     {
    //       "comment": "whitelist /bin/mount",
    //       "gate": "files",
    //       "id": "e7600e88-2b38-4407-95f2-f4915121993a",
    //       "trigger_id": "bcd2d285f87b13dd5d94b770bc7d69bb"
    //     },
    //     {
    //       "comment": "whitelist /bin/ping",
    //       "gate": "files",
    //       "id": "229038ab-b0f1-4c0a-ade9-e73913c1958a",
    //       "trigger_id": "7cb64caf51d7f4215925e7ccc53ef26d"
    //     },
    //     {
    //       "comment": "whitelist /bin/su",
    //       "gate": "files",
    //       "id": "702e4808-c9d1-4710-92a9-1409e9f4b7c1",
    //       "trigger_id": "91192388289daa4ffb2844ac9fbd709f"
    //     },
    //     {
    //       "comment": "whitelist /bin/umount",
    //       "gate": "files",
    //       "id": "d83f7684-739e-46f4-b93c-7c3286b7f6ad",
    //       "trigger_id": "e0ed25fb84059281ae26ad059accb5af"
    //     },
    //     {
    //       "comment": "whitelist /sbin/unix_chkpwd",
    //       "gate": "files",
    //       "id": "eb36bb4f-8618-4be7-ae03-dd702c9b0c14",
    //       "trigger_id": "9b810028f73e670e702c18625d3412c6"
    //     },
    //     {
    //       "comment": "whitelist /usr/bin/chage",
    //       "gate": "files",
    //       "id": "7eaadf43-80f9-47a0-947f-e11703877f5e",
    //       "trigger_id": "75d08d8c7b064bbd44f2f524c924d17b"
    //     },
    //     {
    //       "comment": "whitelist /usr/bin/chfn",
    //       "gate": "files",
    //       "id": "ceef1fb2-a492-4d55-ab94-7021f1b0342e",
    //       "trigger_id": "6329fe232b699ab5b4c9002b9f1b1f9e"
    //     },
    //     {
    //       "comment": "whitelist /usr/bin/chsh",
    //       "gate": "files",
    //       "id": "52809cee-c8f4-4f7a-9456-b2a57d74ed8b",
    //       "trigger_id": "e56b64c2a7d254d4174ecaed69899327"
    //     },
    //     {
    //       "comment": "whitelist /usr/bin/expiry",
    //       "gate": "files",
    //       "id": "7dfe4eb0-6a0e-408e-a3f2-edf956923586",
    //       "trigger_id": "eec438eed6560f1ea7792b726009538e"
    //     },
    //     {
    //       "comment": "whitelist /usr/bin/gpasswd",
    //       "gate": "files",
    //       "id": "9b2f1e32-259d-459e-9cff-3721c6437d97",
    //       "trigger_id": "c2e44319ae5b3b040044d8ae116d1c2f"
    //     },
    //     {
    //       "comment": "whitelist /usr/bin/newgrp",
    //       "gate": "files",
    //       "id": "adad0c37-75d7-42fb-b339-541f3a9b7e6d",
    //       "trigger_id": "463a9a24225c26f7a5bf3f38908e5cb3"
    //     },
    //     {
    //       "comment": "whitelist /usr/bin/passwd",
    //       "gate": "files",
    //       "id": "cd148f3d-e194-44cf-b141-862156449946",
    //       "trigger_id": "bcd159901fe47efddae5c095b4b0d7fd"
    //     },
    //     {
    //       "comment": "whitelist /usr/bin/wall",
    //       "gate": "files",
    //       "id": "fe860460-6090-434f-8f9b-0db7598b36c5",
    //       "trigger_id": "7218d80206fb8d9c1f61ca5650e4e018"
    //     },
    //     {
    //       "comment": "whitelist /usr/local",
    //       "gate": "files",
    //       "id": "8e461763-5891-4187-b112-67d3b84f78e1",
    //       "trigger_id": "8184a3fd4d19d4be5ce6ff8ccb7f3c0b"
    //     },
    //     {
    //       "comment": "whitelist /usr/local/bin",
    //       "gate": "files",
    //       "id": "ea781a63-858c-4c2c-aafb-299f83bb1ea4",
    //       "trigger_id": "efec52a9e0047a01165a9b4c66c3e309"
    //     },
    //     {
    //       "comment": "whitelist /usr/local/etc",
    //       "gate": "files",
    //       "id": "0921d2cd-dc42-4567-890d-5418bf8696f9",
    //       "trigger_id": "b594f2d6aa155f48667ccfaf5f2c3594"
    //     },
    //     {
    //       "comment": "whitelist /usr/local/games",
    //       "gate": "files",
    //       "id": "5915152f-b2b5-467b-bf6f-d6e18c9f370d",
    //       "trigger_id": "bba10ac5ebc153ba4e71697b3d418d65"
    //     },
    //     {
    //       "comment": "whitelist /usr/local/include",
    //       "gate": "files",
    //       "id": "7eb2acfc-6a80-4fb0-ae54-6ad956a76e6a",
    //       "trigger_id": "b75e281338ee0c7cbcd832b2ddb08ee2"
    //     },
    //     {
    //       "comment": "whitelist /usr/local/lib",
    //       "gate": "files",
    //       "id": "6651bf69-bcf6-47ce-b5f8-ff1a7eb6798e",
    //       "trigger_id": "7a5f4bd77193410516ff14766bc7dcf7"
    //     },
    //     {
    //       "comment": "whitelist /usr/local/sbin",
    //       "gate": "files",
    //       "id": "6e00e728-b197-4f92-90fd-61443b7fd976",
    //       "trigger_id": "a6f6a511fa1f3e74819b16a5cfce0c64"
    //     },
    //     {
    //       "comment": "whitelist /usr/local/share",
    //       "gate": "files",
    //       "id": "1bafaa01-ce7d-4144-a61e-7bf1ce604c63",
    //       "trigger_id": "5b885be0bf4df9242b891ed99e19f2dd"
    //     },
    //     {
    //       "comment": "whitelist /usr/local/share/man",
    //       "gate": "files",
    //       "id": "1e59efa8-4f4c-4d0e-807c-127a582dd7e4",
    //       "trigger_id": "c8479172735f4621d6f0ee91508e8836"
    //     },
    //     {
    //       "comment": "whitelist /usr/local/src",
    //       "gate": "files",
    //       "id": "0dd72ce6-a48c-4c88-9fc1-721e48a8e286",
    //       "trigger_id": "0a273cc51988ca03e23154ce9672b2d4"
    //     },
    //     {
    //       "comment": "whitelist /var/local",
    //       "gate": "files",
    //       "id": "6833f3bb-feac-4429-b11a-873c217aeec5",
    //       "trigger_id": "4f9abc83a7a1c95e222b659e0fab27fa"
    //     },
    //     {
    //       "comment": "whitelist /var/mail",
    //       "gate": "files",
    //       "id": "a6e611c2-a954-42e7-b7eb-6afc46642a59",
    //       "trigger_id": "da870e801836e419385f2f300713cf7f"
    //     }
    //   ],
    //   "name": "DEB SUID Files",
    //   "version": "1_0"
    // }
  ]
};

fs.writeFileSync(outputPath, Buffer.from(JSON.stringify(policy, null, 2)))