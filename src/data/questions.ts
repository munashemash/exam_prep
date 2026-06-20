import {
  longQuestionSchema,
  mcqQuestionSchema,
  questionBankSchema,
  type LongQuestion,
  type MCQQuestion,
  type Question,
  type Topic,
} from "@/types/questions";

const rawMcqQuestions: MCQQuestion[] = [
  {
    id: "osi-001",
    type: "mcq",
    topic: "osi",
    year: 2026,
    difficulty: "easy",
    marks: 1,
    question: "Which ISO OSI layer provides process-to-process delivery?",
    options: ["Layer 2", "Layer 3", "Layer 4", "Layer 6", "Layer 7"],
    correctAnswer: 2,
    explanation:
      "Layer 4, the transport layer, provides process-to-process delivery using ports.",
    commonMistakes: ["Choosing Layer 3 because IP delivers between hosts."],
  },
  {
    id: "osi-002",
    type: "mcq",
    topic: "osi",
    year: 2026,
    difficulty: "easy",
    marks: 1,
    question:
      "The OSI presentation layer is positioned between which two layers?",
    options: [
      "Network and Transport",
      "Transport and Session",
      "Session and Application",
      "Data Link and Network",
    ],
    correctAnswer: 2,
    explanation:
      "Layer 6, the presentation layer, sits between Layer 5 session and Layer 7 application.",
    commonMistakes: ["Confusing presentation with application."],
  },
  {
    id: "osi-003",
    type: "mcq",
    topic: "osi",
    year: 2025,
    difficulty: "medium",
    marks: 1,
    question:
      "Which OSI layer is associated with functionality resembling database transactions?",
    options: ["Layer 2", "Layer 3", "Layer 4", "Layer 5", "Layer 7"],
    correctAnswer: 3,
    explanation:
      "The session layer may provide dialogue control and transaction-like behaviour.",
    commonMistakes: ["Choosing Layer 4 because TCP is reliable."],
  },
  {
    id: "osi-004",
    type: "mcq",
    topic: "osi",
    year: 2025,
    difficulty: "easy",
    marks: 1,
    question: "Which OSI layer is responsible for routing between networks?",
    options: ["Layer 1", "Layer 2", "Layer 3", "Layer 4"],
    correctAnswer: 2,
    explanation:
      "Layer 3, the network layer, handles logical addressing and routing.",
    commonMistakes: ["Choosing Layer 2 because switches forward frames."],
  },
  {
    id: "osi-005",
    type: "mcq",
    topic: "osi",
    year: 2025,
    difficulty: "easy",
    marks: 1,
    question:
      "Which OSI layer is mainly concerned with framing and MAC addressing?",
    options: ["Layer 1", "Layer 2", "Layer 3", "Layer 4"],
    correctAnswer: 1,
    explanation:
      "Layer 2, the data link layer, deals with frames, MAC addresses and medium access.",
    commonMistakes: ["Choosing Layer 3 because it also has addresses."],
  },

  {
    id: "dns-001",
    type: "mcq",
    topic: "dns",
    year: 2026,
    difficulty: "easy",
    marks: 1,
    question: "Which DNS record maps a hostname to an IPv4 address?",
    options: ["AAAA", "MX", "A", "NS"],
    correctAnswer: 2,
    explanation: "An A record maps a DNS name to an IPv4 address.",
    commonMistakes: ["Confusing A with AAAA, which maps to IPv6."],
  },
  {
    id: "dns-002",
    type: "mcq",
    topic: "dns",
    year: 2026,
    difficulty: "easy",
    marks: 1,
    question: "Which DNS record maps a hostname to an IPv6 address?",
    options: ["A", "AAAA", "MX", "PTR"],
    correctAnswer: 1,
    explanation: "An AAAA record maps a name to an IPv6 address.",
    commonMistakes: ["Using A records for IPv6."],
  },
  {
    id: "dns-003",
    type: "mcq",
    topic: "dns",
    year: 2026,
    difficulty: "easy",
    marks: 1,
    question: "Which DNS record specifies mail servers for a domain?",
    options: ["NS", "MX", "CNAME", "SOA"],
    correctAnswer: 1,
    explanation:
      "MX records identify mail exchangers for a domain and may include priorities.",
    commonMistakes: ["Choosing NS because nameservers are also servers."],
  },
  {
    id: "dns-004",
    type: "mcq",
    topic: "dns",
    year: 2026,
    difficulty: "medium",
    marks: 1,
    question: "What is DNS delegation?",
    options: [
      "Caching DNS answers",
      "Assigning authority for part of the namespace",
      "Converting names to IP addresses",
      "Creating a CNAME alias",
    ],
    correctAnswer: 1,
    explanation:
      "Delegation means authority over a subdomain is assigned to other name servers, usually using NS records.",
    commonMistakes: ["Confusing delegation with name resolution."],
  },
  {
    id: "dns-005",
    type: "mcq",
    topic: "dns",
    year: 2026,
    difficulty: "easy",
    marks: 1,
    question:
      "What is the process of converting a fully qualified domain name to an address called?",
    options: ["Delegation", "Name resolution", "Registration", "Routing"],
    correctAnswer: 1,
    explanation:
      "Name resolution is the process of resolving a name to an address.",
    commonMistakes: ["Confusing registration with resolution."],
  },
  {
    id: "dns-006",
    type: "mcq",
    topic: "dns",
    year: 2026,
    difficulty: "medium",
    marks: 1,
    question: "Which South African body controls the .za ccTLD?",
    options: ["ZACR", "ZADNA", "ICANN", "AfriNIC"],
    correctAnswer: 1,
    explanation: "ZADNA controls the .za country-code top-level domain.",
    commonMistakes: [
      "Choosing ZACR, which operates some second-level domains.",
    ],
  },
  {
    id: "dns-007",
    type: "mcq",
    topic: "dns",
    year: 2025,
    difficulty: "medium",
    marks: 1,
    question: "Which organisation allocates IP address blocks in Africa?",
    options: ["RIPE", "APNIC", "AfriNIC", "ICANN"],
    correctAnswer: 2,
    explanation: "AfriNIC is the Regional Internet Registry for Africa.",
    commonMistakes: ["Choosing ICANN because it has global authority."],
  },
  {
    id: "dns-008",
    type: "mcq",
    topic: "dns",
    year: 2025,
    difficulty: "medium",
    marks: 1,
    question:
      "Which record is normally used to create an alias from one DNS name to another?",
    options: ["A", "AAAA", "CNAME", "MX"],
    correctAnswer: 2,
    explanation: "A CNAME record points one name to another canonical name.",
    commonMistakes: ["Using A records when the target is another name."],
  },

  {
    id: "http-001",
    type: "mcq",
    topic: "http",
    year: 2026,
    difficulty: "easy",
    marks: 1,
    question: "What does HTTP status code 200 indicate?",
    options: [
      "Resource moved",
      "Request succeeded",
      "Client error",
      "Server error",
    ],
    correctAnswer: 1,
    explanation: "HTTP 200 means the request was processed successfully.",
    commonMistakes: ["Confusing 200 with 301 or 404."],
  },
  {
    id: "http-002",
    type: "mcq",
    topic: "http",
    year: 2026,
    difficulty: "easy",
    marks: 1,
    question: "What does the HTTP Content-Type header indicate?",
    options: [
      "The client IP address",
      "The MIME type of the response body",
      "The server's port",
      "The TCP window size",
    ],
    correctAnswer: 1,
    explanation:
      "Content-Type describes the MIME type of the content in the response body, such as text/html.",
    commonMistakes: ["Saying it indicates the file extension only."],
  },
  {
    id: "http-003",
    type: "mcq",
    topic: "http",
    year: 2026,
    difficulty: "easy",
    marks: 1,
    question:
      "Which HTTP method requests the header without the response body?",
    options: ["GET", "HEAD", "POST", "PUT"],
    correctAnswer: 1,
    explanation:
      "HEAD requests the response headers without the response body.",
    commonMistakes: ["Choosing GET, which requests the body as well."],
  },
  {
    id: "http-004",
    type: "mcq",
    topic: "http",
    year: 2025,
    difficulty: "medium",
    marks: 1,
    question: "Why does HTTP include a Host header?",
    options: [
      "To indicate TCP reliability",
      "To support virtual hosting",
      "To specify a subnet mask",
      "To start TLS",
    ],
    correctAnswer: 1,
    explanation:
      "The Host header lets one server host multiple domains on the same IP address.",
    commonMistakes: ["Thinking Host identifies the client."],
  },
  {
    id: "http-005",
    type: "mcq",
    topic: "http",
    year: 2026,
    difficulty: "easy",
    marks: 1,
    question: "What separates an HTTP response header from the response body?",
    options: [
      "A blank line",
      "A FIN segment",
      "A DNS record",
      "A MIME boundary only",
    ],
    correctAnswer: 0,
    explanation:
      "In HTTP, an empty line separates the header section from the body.",
    commonMistakes: [
      "Confusing MIME boundaries with HTTP header/body separation.",
    ],
  },

  {
    id: "email-001",
    type: "mcq",
    topic: "email",
    year: 2026,
    difficulty: "easy",
    marks: 1,
    question:
      "Which protocol is primarily used to retrieve email from a mailbox on a server?",
    options: ["SMTP", "POP3", "DNS", "BGP"],
    correctAnswer: 1,
    explanation:
      "POP3 is used by a mail client to retrieve messages from a server mailbox.",
    commonMistakes: ["Choosing SMTP, which is used to send mail."],
  },
  {
    id: "email-002",
    type: "mcq",
    topic: "email",
    year: 2026,
    difficulty: "easy",
    marks: 1,
    question: "Which protocol is used to send email between mail systems?",
    options: ["POP3", "IMAP4", "SMTP", "LDAP"],
    correctAnswer: 2,
    explanation: "SMTP is used to send or relay email.",
    commonMistakes: ["Confusing message retrieval with message sending."],
  },
  {
    id: "email-003",
    type: "mcq",
    topic: "email",
    year: 2025,
    difficulty: "medium",
    marks: 1,
    question: "Which SMTP command identifies the recipient?",
    options: ["HELO", "MAIL FROM", "RCPT TO", "DATA"],
    correctAnswer: 2,
    explanation: "RCPT TO specifies the recipient address.",
    commonMistakes: [
      "Choosing MAIL FROM, which identifies the envelope sender.",
    ],
  },
  {
    id: "email-004",
    type: "mcq",
    topic: "email",
    year: 2025,
    difficulty: "medium",
    marks: 1,
    question: "Which SMTP command marks the start of the message content?",
    options: ["HELO", "DATA", "RCPT TO", "QUIT"],
    correctAnswer: 1,
    explanation: "DATA indicates that the message headers and body follow.",
    commonMistakes: ["Choosing MAIL FROM or RCPT TO."],
  },
  {
    id: "email-005",
    type: "mcq",
    topic: "email",
    year: 2026,
    difficulty: "medium",
    marks: 1,
    question: "Which POP3 command retrieves a specific message?",
    options: ["STAT", "LIST", "RETR", "DELE"],
    correctAnswer: 2,
    explanation: "RETR retrieves the content of a selected message.",
    commonMistakes: [
      "Choosing LIST, which lists messages rather than retrieving one.",
    ],
  },
  {
    id: "email-006",
    type: "mcq",
    topic: "email",
    year: 2026,
    difficulty: "medium",
    marks: 1,
    question: "Which POP3 command marks a message for deletion?",
    options: ["RETR", "DELE", "STAT", "USER"],
    correctAnswer: 1,
    explanation:
      "DELE marks a message for deletion, usually applied when the session enters the update state.",
    commonMistakes: ["Thinking RETR deletes after retrieval automatically."],
  },

  {
    id: "utf8-001",
    type: "mcq",
    topic: "utf8",
    year: 2026,
    difficulty: "easy",
    marks: 1,
    question:
      "How many bytes are used by a UTF-8 sequence whose first byte begins with 1110?",
    options: ["1", "2", "3", "4"],
    correctAnswer: 2,
    explanation:
      "The leading pattern 1110xxxx identifies a three-byte UTF-8 sequence.",
    commonMistakes: [
      "Counting all leading 1s instead of recognising the pattern.",
    ],
  },
  {
    id: "utf8-002",
    type: "mcq",
    topic: "utf8",
    year: 2026,
    difficulty: "easy",
    marks: 1,
    question: "What bit pattern identifies a UTF-8 continuation byte?",
    options: ["0xxxxxxx", "10xxxxxx", "110xxxxx", "1110xxxx"],
    correctAnswer: 1,
    explanation: "Every UTF-8 continuation byte has the form 10xxxxxx.",
    commonMistakes: ["Confusing leading bytes and continuation bytes."],
  },
  {
    id: "utf8-003",
    type: "mcq",
    topic: "utf8",
    year: 2026,
    difficulty: "medium",
    marks: 1,
    question: "How many payload bits are available in a 2-byte UTF-8 sequence?",
    options: ["7", "11", "16", "21"],
    correctAnswer: 1,
    explanation:
      "A two-byte sequence has 5 payload bits in the first byte and 6 in the continuation byte, so 11 payload bits.",
    commonMistakes: ["Using 16 total bits instead of payload bits."],
  },
  {
    id: "utf8-004",
    type: "mcq",
    topic: "utf8",
    year: 2026,
    difficulty: "medium",
    marks: 1,
    question: "How many payload bits are available in a 3-byte UTF-8 sequence?",
    options: ["11", "16", "21", "24"],
    correctAnswer: 1,
    explanation: "A three-byte UTF-8 sequence has 4 + 6 + 6 = 16 payload bits.",
    commonMistakes: ["Using 24 total bits."],
  },
  {
    id: "utf8-005",
    type: "mcq",
    topic: "utf8",
    year: 2025,
    difficulty: "medium",
    marks: 1,
    question: "Which UTF-8 byte sequence represents U+00E4?",
    options: ["C3 A4", "E1 A4", "A4 C3", "F0 9F A4"],
    correctAnswer: 0,
    explanation: "U+00E4 requires two UTF-8 bytes. Its encoding is C3 A4.",
    commonMistakes: ["Writing bytes in reverse order."],
  },
  {
    id: "utf8-006",
    type: "mcq",
    topic: "utf8",
    year: 2025,
    difficulty: "medium",
    marks: 1,
    question: "Which UTF-8 byte sequence represents U+039E?",
    options: ["CE 9E", "C3 9E", "E0 9E 9E", "9E CE"],
    correctAnswer: 0,
    explanation: "U+039E is encoded as CE 9E in UTF-8.",
    commonMistakes: [
      "Treating all non-ASCII characters as three-byte sequences.",
    ],
  },
  {
    id: "utf8-007",
    type: "mcq",
    topic: "utf8",
    year: 2025,
    difficulty: "medium",
    marks: 1,
    question: "Which UTF-8 byte sequence represents U+179F?",
    options: ["C1 9F", "E1 9E 9F", "F0 91 9E 9F", "17 9F"],
    correctAnswer: 1,
    explanation: "U+179F requires a three-byte UTF-8 sequence: E1 9E 9F.",
    commonMistakes: ["Dropping the leading byte."],
  },
  {
    id: "utf8-008",
    type: "mcq",
    topic: "utf8",
    year: 2025,
    difficulty: "hard",
    marks: 1,
    question: "Why is F2 B3 7F BA not a valid UTF-8 sequence?",
    options: [
      "It is too short",
      "7F is not a continuation byte",
      "F2 is never valid",
      "BA is ASCII",
    ],
    correctAnswer: 1,
    explanation:
      "After a leading four-byte marker, all following bytes must be continuation bytes of the form 10xxxxxx. 7F does not match.",
    commonMistakes: [
      "Assuming any hexadecimal byte can appear after the first byte.",
    ],
  },

  {
    id: "tcp-001",
    type: "mcq",
    topic: "tcp",
    year: 2026,
    difficulty: "easy",
    marks: 1,
    question: "Which TCP flags consume phantom bytes?",
    options: ["ACK only", "SYN and FIN", "PSH and URG", "RST only"],
    correctAnswer: 1,
    explanation:
      "SYN and FIN consume sequence numbers even when no application data is carried.",
    commonMistakes: ["Thinking ACK consumes sequence numbers."],
  },
  {
    id: "tcp-002",
    type: "mcq",
    topic: "tcp",
    year: 2026,
    difficulty: "medium",
    marks: 1,
    question: "In TCP, what does an acknowledgement number indicate?",
    options: [
      "The last byte received",
      "The next byte expected",
      "The sender window size",
      "The number of retransmissions",
    ],
    correctAnswer: 1,
    explanation:
      "TCP acknowledgement numbers are cumulative and indicate the next byte expected.",
    commonMistakes: ["Answering the last byte received."],
  },
  {
    id: "tcp-003",
    type: "mcq",
    topic: "tcp",
    year: 2026,
    difficulty: "medium",
    marks: 1,
    question: "Which TCP timer is used to detect a lost segment?",
    options: [
      "Keepalive timer",
      "Retransmission timeout",
      "TIME-WAIT timer",
      "Acknowledgement timer",
    ],
    correctAnswer: 1,
    explanation:
      "The retransmission timeout expires when an ACK is not received in time, causing retransmission.",
    commonMistakes: ["Confusing keepalive with retransmission."],
  },
  {
    id: "tcp-004",
    type: "mcq",
    topic: "tcp",
    year: 2026,
    difficulty: "medium",
    marks: 1,
    question: "What is the purpose of the TCP acknowledgement timer?",
    options: [
      "Retransmit lost data",
      "Send an ACK when no piggy-back opportunity occurs",
      "Close idle connections",
      "Prevent fragmentation",
    ],
    correctAnswer: 1,
    explanation:
      "The acknowledgement timer ensures received data is acknowledged even when there is no outgoing data to carry the ACK.",
    commonMistakes: ["Confusing it with retransmission timeout."],
  },
  {
    id: "tcp-005",
    type: "mcq",
    topic: "tcp",
    year: 2026,
    difficulty: "medium",
    marks: 1,
    question: "What does the TCP keepalive mechanism do?",
    options: [
      "Encrypts idle connections",
      "Checks whether an idle connection endpoint is still alive",
      "Increases the receive window",
      "Resolves host names",
    ],
    correctAnswer: 1,
    explanation:
      "Keepalive sends probe TCP segments after long inactivity to determine whether the peer is still functional.",
    commonMistakes: ["Thinking keepalive is a congestion-control mechanism."],
  },
  {
    id: "tcp-006",
    type: "mcq",
    topic: "tcp",
    year: 2026,
    difficulty: "medium",
    marks: 1,
    question: "What is the role of the receiver window in TCP?",
    options: [
      "Prevent receiver buffer overflow",
      "Prevent network congestion",
      "Store DNS records",
      "Calculate checksums",
    ],
    correctAnswer: 0,
    explanation:
      "The receiver window advertises how many bytes the receiver can still accept.",
    commonMistakes: ["Confusing receiver window with congestion window."],
  },
  {
    id: "tcp-007",
    type: "mcq",
    topic: "tcp",
    year: 2026,
    difficulty: "medium",
    marks: 1,
    question: "What is the role of the congestion window in TCP?",
    options: [
      "Prevent receiver buffer overflow",
      "Limit transmission to avoid network congestion",
      "Map names to addresses",
      "Choose DNS servers",
    ],
    correctAnswer: 1,
    explanation:
      "The congestion window limits how much data the sender injects into the network.",
    commonMistakes: ["Confusing it with advertised window."],
  },
  {
    id: "tcp-008",
    type: "mcq",
    topic: "tcp",
    year: 2025,
    difficulty: "medium",
    marks: 1,
    question: "What is TCP slow start?",
    options: [
      "A DNS lookup process",
      "A mechanism that starts with a small congestion window and grows it as ACKs arrive",
      "A method of delaying ACKs forever",
      "A UDP feature",
    ],
    correctAnswer: 1,
    explanation:
      "Slow start begins with a small cwnd and increases it as acknowledgements are received.",
    commonMistakes: [
      "Thinking slow start means intentionally slow application delivery.",
    ],
  },
  {
    id: "tcp-009",
    type: "mcq",
    topic: "tcp",
    year: 2026,
    difficulty: "hard",
    marks: 1,
    question:
      "If A sends LEN=200 starting with SEQ=600, what is A's next sequence number?",
    options: ["600", "601", "800", "801"],
    correctAnswer: 2,
    explanation:
      "For data, the next sequence number is current SEQ plus LEN: 600 + 200 = 800.",
    commonMistakes: [
      "Adding one unnecessarily; only SYN and FIN consume phantom bytes.",
    ],
  },
  {
    id: "tcp-010",
    type: "mcq",
    topic: "tcp",
    year: 2026,
    difficulty: "hard",
    marks: 1,
    question:
      "If a host receives bytes up to and including byte 900 in a TCP stream, what ACK number should it send?",
    options: ["899", "900", "901", "902"],
    correctAnswer: 2,
    explanation:
      "TCP ACK indicates the next expected byte, so after receiving byte 900 the ACK is 901.",
    commonMistakes: [
      "Sending the last received byte instead of the next expected byte.",
    ],
  },

  {
    id: "routing-001",
    type: "mcq",
    topic: "routing",
    year: 2025,
    difficulty: "easy",
    marks: 1,
    question: "Which routing protocol uses hop count as its primary metric?",
    options: ["RIP", "OSPF", "BGP", "ARP"],
    correctAnswer: 0,
    explanation: "RIP uses hop count as its routing metric.",
    commonMistakes: ["Choosing OSPF, which uses cost."],
  },
  {
    id: "routing-002",
    type: "mcq",
    topic: "routing",
    year: 2026,
    difficulty: "easy",
    marks: 1,
    question: "Which algorithm is associated with OSPF?",
    options: ["Bellman-Ford", "Dijkstra", "Huffman", "CRC"],
    correctAnswer: 1,
    explanation: "OSPF uses Dijkstra's shortest-path algorithm.",
    commonMistakes: ["Confusing OSPF with RIP."],
  },
  {
    id: "routing-003",
    type: "mcq",
    topic: "routing",
    year: 2025,
    difficulty: "medium",
    marks: 1,
    question: "BGP determines routes between what?",
    options: ["Frames", "Autonomous systems", "MAC addresses", "Ports"],
    correctAnswer: 1,
    explanation:
      "BGP is an exterior gateway protocol used between autonomous systems.",
    commonMistakes: ["Thinking BGP is an interior routing protocol."],
  },
  {
    id: "routing-004",
    type: "mcq",
    topic: "routing",
    year: 2026,
    difficulty: "medium",
    marks: 1,
    question: "What does the routing table entry 0.0.0.0/0 usually represent?",
    options: [
      "Localhost",
      "Default route",
      "Broadcast address",
      "Private address",
    ],
    correctAnswer: 1,
    explanation:
      "0.0.0.0/0 matches any IPv4 address and is normally used as the default route.",
    commonMistakes: ["Confusing it with 127.0.0.1."],
  },
  {
    id: "routing-005",
    type: "mcq",
    topic: "routing",
    year: 2026,
    difficulty: "medium",
    marks: 1,
    question:
      "Which routing algorithm is used by RIP-style distance-vector routing?",
    options: ["Dijkstra", "Bellman-Ford", "RSA", "Hamming"],
    correctAnswer: 1,
    explanation:
      "Distance-vector routing is based on the Bellman-Ford algorithm.",
    commonMistakes: [
      "Choosing Dijkstra because it is also a routing algorithm.",
    ],
  },

  {
    id: "asn1-001",
    type: "mcq",
    topic: "asn1",
    year: 2025,
    difficulty: "medium",
    marks: 1,
    question: "Which of the following is not a valid ASN.1 constructor?",
    options: ["SEQUENCE", "SET", "CHOICE", "MESSAGE"],
    correctAnswer: 3,
    explanation:
      "MESSAGE is not an ASN.1 constructor in the lecturer's tested terminology.",
    commonMistakes: [
      "Assuming MESSAGE is valid because it sounds protocol-related.",
    ],
  },
  {
    id: "asn1-002",
    type: "mcq",
    topic: "asn1",
    year: 2025,
    difficulty: "medium",
    marks: 1,
    question: "LDAP information is stored in a tree known as the:",
    options: [
      "Routing tree",
      "Directory Information Tree",
      "Domain root tree",
      "Binary encoding tree",
    ],
    correctAnswer: 1,
    explanation: "LDAP uses a Directory Information Tree (DIT).",
    commonMistakes: ["Confusing LDAP with DNS hierarchy."],
  },
  {
    id: "asn1-003",
    type: "mcq",
    topic: "asn1",
    year: 2025,
    difficulty: "medium",
    marks: 1,
    question: "What does BER provide for ASN.1?",
    options: [
      "Routing",
      "Encoding rules",
      "IP addressing",
      "Domain delegation",
    ],
    correctAnswer: 1,
    explanation: "BER specifies Basic Encoding Rules for ASN.1 data.",
    commonMistakes: ["Thinking ASN.1 itself is the byte encoding."],
  },

  {
    id: "layer2-001",
    type: "mcq",
    topic: "layer2",
    year: 2026,
    difficulty: "easy",
    marks: 1,
    question: "Which IEEE standard is associated with Ethernet?",
    options: ["802.3", "802.4", "802.5", "802.11"],
    correctAnswer: 0,
    explanation: "IEEE 802.3 is Ethernet.",
    commonMistakes: ["Confusing Ethernet with Token Ring."],
  },
  {
    id: "layer2-002",
    type: "mcq",
    topic: "layer2",
    year: 2026,
    difficulty: "easy",
    marks: 1,
    question: "Which IEEE standard is associated with Token Ring?",
    options: ["802.3", "802.4", "802.5", "802.11"],
    correctAnswer: 2,
    explanation: "IEEE 802.5 is Token Ring.",
    commonMistakes: ["Choosing 802.3."],
  },
  {
    id: "layer2-003",
    type: "mcq",
    topic: "layer2",
    year: 2026,
    difficulty: "medium",
    marks: 1,
    question: "What is the purpose of token passing?",
    options: [
      "To resolve DNS names",
      "To control which node may transmit",
      "To encrypt frames",
      "To fragment IP datagrams",
    ],
    correctAnswer: 1,
    explanation:
      "Token passing controls medium access by allowing only the token holder to transmit.",
    commonMistakes: ["Thinking token passing is authentication."],
  },
  {
    id: "layer2-004",
    type: "mcq",
    topic: "layer2",
    year: 2026,
    difficulty: "medium",
    marks: 1,
    question: "What is data delineation?",
    options: [
      "Marking frame boundaries",
      "Resolving IP addresses",
      "Choosing routes",
      "Compressing text",
    ],
    correctAnswer: 0,
    explanation:
      "Data delineation marks where frames start and end in a stream of bits.",
    commonMistakes: ["Confusing delineation with error correction."],
  },
  {
    id: "layer2-005",
    type: "mcq",
    topic: "layer2",
    year: 2026,
    difficulty: "medium",
    marks: 1,
    question:
      "Which flag is commonly associated with HDLC/SDLC frame delineation?",
    options: ["01111110", "00000000", "11111111", "10101010"],
    correctAnswer: 0,
    explanation:
      "HDLC/SDLC frames use the flag pattern 01111110 to mark frame boundaries.",
    commonMistakes: ["Using a preamble pattern instead of the HDLC flag."],
  },

  {
    id: "ip-001",
    type: "mcq",
    topic: "ipv4_ipv6",
    year: 2026,
    difficulty: "easy",
    marks: 1,
    question: "How many bits are in an IPv6 address?",
    options: ["32", "64", "128", "256"],
    correctAnswer: 2,
    explanation: "IPv6 addresses are 128 bits long.",
    commonMistakes: ["Choosing 64 due to interface identifiers."],
  },
  {
    id: "ip-002",
    type: "mcq",
    topic: "ipv4_ipv6",
    year: 2026,
    difficulty: "medium",
    marks: 1,
    question:
      "What happens if an IPv4 datagram has Don't Fragment set and must cross a link with a smaller MTU?",
    options: [
      "It is fragmented anyway",
      "It is discarded",
      "It becomes IPv6",
      "It becomes a TCP segment",
    ],
    correctAnswer: 1,
    explanation:
      "If fragmentation is forbidden and the datagram is too large, it must be discarded.",
    commonMistakes: ["Ignoring the Don't Fragment flag."],
  },
  {
    id: "ip-003",
    type: "mcq",
    topic: "ipv4_ipv6",
    year: 2026,
    difficulty: "easy",
    marks: 1,
    question: "What is the primary purpose of NAT?",
    options: [
      "Conserve public IPv4 addresses",
      "Replace DNS",
      "Encrypt traffic",
      "Increase the IPv6 address size",
    ],
    correctAnswer: 0,
    explanation:
      "NAT allows many private hosts to share one or fewer public IPv4 addresses.",
    commonMistakes: ["Saying NAT's primary purpose is security."],
  },
  {
    id: "ip-004",
    type: "mcq",
    topic: "ipv4_ipv6",
    year: 2025,
    difficulty: "medium",
    marks: 1,
    question: "What does ARP resolve?",
    options: [
      "Domain names to IP addresses",
      "IPv4 addresses to MAC addresses",
      "Ports to processes",
      "Routes to autonomous systems",
    ],
    correctAnswer: 1,
    explanation:
      "ARP resolves an IPv4 address to a MAC address on the local link.",
    commonMistakes: ["Confusing ARP with DNS."],
  },
  {
    id: "ip-005",
    type: "mcq",
    topic: "ipv4_ipv6",
    year: 2025,
    difficulty: "medium",
    marks: 1,
    question: "What ICMP packet does ping use?",
    options: ["Echo", "SYN", "FIN", "MX"],
    correctAnswer: 0,
    explanation: "Ping uses ICMP Echo Request and Echo Reply messages.",
    commonMistakes: ["Thinking ping uses TCP SYN."],
  },

  {
    id: "subnet-001",
    type: "mcq",
    topic: "subnetting",
    year: 2026,
    difficulty: "easy",
    marks: 1,
    question: "What is the subnet mask for /26?",
    options: [
      "255.255.255.0",
      "255.255.255.128",
      "255.255.255.192",
      "255.255.255.224",
    ],
    correctAnswer: 2,
    explanation:
      "/26 means 26 network bits. The last octet is 11000000, which is 192.",
    commonMistakes: ["Confusing /26 with /25."],
  },
  {
    id: "subnet-002",
    type: "mcq",
    topic: "subnetting",
    year: 2026,
    difficulty: "easy",
    marks: 1,
    question: "How many usable host addresses are in a /26 subnet?",
    options: ["30", "62", "64", "126"],
    correctAnswer: 1,
    explanation:
      "/26 leaves 6 host bits. 2^6 = 64 total addresses, minus network and broadcast gives 62 usable.",
    commonMistakes: ["Forgetting to subtract two addresses."],
  },
  {
    id: "subnet-003",
    type: "mcq",
    topic: "subnetting",
    year: 2026,
    difficulty: "medium",
    marks: 1,
    question: "What is the block size of a /26 subnet in the last octet?",
    options: ["16", "32", "64", "128"],
    correctAnswer: 2,
    explanation: "The mask is 255.255.255.192. Block size is 256 - 192 = 64.",
    commonMistakes: ["Using usable hosts as the block size."],
  },
  {
    id: "subnet-004",
    type: "mcq",
    topic: "subnetting",
    year: 2026,
    difficulty: "medium",
    marks: 1,
    question: "What is the broadcast address of 10.10.8.0/26?",
    options: ["10.10.8.62", "10.10.8.63", "10.10.8.64", "10.10.8.255"],
    correctAnswer: 1,
    explanation:
      "/26 block size is 64, so 10.10.8.0/26 spans .0 to .63. The broadcast is .63.",
    commonMistakes: ["Giving the last usable host .62."],
  },
  {
    id: "subnet-005",
    type: "mcq",
    topic: "subnetting",
    year: 2026,
    difficulty: "medium",
    marks: 1,
    question: "What is the first usable host of 10.10.8.0/26?",
    options: ["10.10.8.0", "10.10.8.1", "10.10.8.62", "10.10.8.63"],
    correctAnswer: 1,
    explanation: "The first usable host is the network address plus one.",
    commonMistakes: ["Using the network address as a host."],
  },
  {
    id: "subnet-006",
    type: "mcq",
    topic: "subnetting",
    year: 2026,
    difficulty: "medium",
    marks: 1,
    question: "What is the last usable host of 10.10.8.0/26?",
    options: ["10.10.8.61", "10.10.8.62", "10.10.8.63", "10.10.8.64"],
    correctAnswer: 1,
    explanation: "The broadcast is .63, so the last usable host is .62.",
    commonMistakes: ["Using the broadcast address as a host."],
  },
  {
    id: "subnet-007",
    type: "mcq",
    topic: "subnetting",
    year: 2025,
    difficulty: "medium",
    marks: 1,
    question: "What is the subnet mask for /22?",
    options: [
      "255.255.255.0",
      "255.255.252.0",
      "255.255.248.0",
      "255.255.192.0",
    ],
    correctAnswer: 1,
    explanation: "/22 means 22 network bits: 255.255.252.0.",
    commonMistakes: ["Confusing /22 with /21 or /24."],
  },
  {
    id: "subnet-008",
    type: "mcq",
    topic: "subnetting",
    year: 2025,
    difficulty: "medium",
    marks: 1,
    question: "What is the broadcast address of 222.222.220.0/22?",
    options: [
      "222.222.220.255",
      "222.222.221.255",
      "222.222.223.255",
      "222.222.224.255",
    ],
    correctAnswer: 2,
    explanation:
      "/22 has a block size of 4 in the third octet, so 220 through 223 are included. Broadcast is 222.222.223.255.",
    commonMistakes: ["Treating it like a /24."],
  },
  {
    id: "subnet-009",
    type: "mcq",
    topic: "subnetting",
    year: 2025,
    difficulty: "hard",
    marks: 1,
    question:
      "If 172.31.64.0/18 must be divided into at least 100 subnets with at least 100 hosts each, which prefix length should be used?",
    options: ["/24", "/25", "/26", "/27"],
    correctAnswer: 1,
    explanation:
      "At least 100 hosts requires 7 host bits because 2^7 - 2 = 126. Therefore prefix is /25.",
    commonMistakes: ["Choosing /26, which only gives 62 usable hosts."],
  },
  {
    id: "subnet-010",
    type: "mcq",
    topic: "subnetting",
    year: 2025,
    difficulty: "hard",
    marks: 1,
    question: "What is the subnet mask for /25?",
    options: [
      "255.255.255.0",
      "255.255.255.128",
      "255.255.255.192",
      "255.255.254.0",
    ],
    correctAnswer: 1,
    explanation: "/25 has one network bit in the last octet: 10000000 = 128.",
    commonMistakes: ["Choosing /26 mask 255.255.255.192."],
  },
];

const rawLongQuestions: LongQuestion[] = [
  {
    id: "long-subnet-001",
    type: "long",
    topic: "subnetting",
    year: 2026,
    difficulty: "medium",
    marks: 10,
    question: "Explain CIDR and how it helped delay IPv4 address exhaustion.",
    answer: {
      definition:
        "CIDR is Classless Inter-Domain Routing. It uses variable-length prefixes instead of fixed class A, B and C boundaries.",
      mechanism:
        "Address blocks are allocated according to need using prefixes such as /22, /26 or /30.",
      purpose:
        "CIDR reduces address wastage and enables route aggregation, which also reduces routing table size.",
      example:
        "A network needing about 60 hosts can receive a /26 with 62 usable hosts instead of wasting an entire /24.",
    },
  },
  {
    id: "long-subnet-002",
    type: "long",
    topic: "subnetting",
    year: 2026,
    difficulty: "medium",
    marks: 10,
    question:
      "For 10.10.8.0/26, give the subnet mask, network address, broadcast address, first usable host and last usable host.",
    answer: {
      definition: "A /26 network has 26 network bits and 6 host bits.",
      mechanism:
        "The mask is 255.255.255.192. The block size is 64, so the subnet 10.10.8.0/26 spans 10.10.8.0 to 10.10.8.63.",
      purpose:
        "The calculation identifies which addresses define the subnet and which can be assigned to hosts.",
      example:
        "Network: 10.10.8.0. Broadcast: 10.10.8.63. First host: 10.10.8.1. Last host: 10.10.8.62.",
    },
  },
  {
    id: "long-subnet-003",
    type: "long",
    topic: "subnetting",
    year: 2025,
    difficulty: "hard",
    marks: 10,
    question:
      "Explain how to choose a subnet prefix when a network must support at least 100 hosts per subnet.",
    answer: {
      definition:
        "The prefix determines how many bits are used for the network and how many remain for host addresses.",
      mechanism:
        "Find the smallest number of host bits h such that 2^h - 2 is at least 100. h = 7 gives 126 usable hosts.",
      purpose:
        "This prevents wasting addresses while still meeting the host requirement.",
      example:
        "With 7 host bits, the prefix is 32 - 7 = /25, and the mask is 255.255.255.128.",
    },
  },
  {
    id: "long-tcp-001",
    type: "long",
    topic: "tcp",
    year: 2026,
    difficulty: "hard",
    marks: 10,
    question: "Explain TCP connection establishment and termination.",
    answer: {
      definition: "TCP is a connection-oriented transport-layer protocol.",
      mechanism:
        "Connection establishment uses SYN, SYN+ACK and ACK. Termination uses FIN and ACK exchanges, with TIME-WAIT after closure in common cases.",
      purpose:
        "The establishment handshake synchronises sequence numbers. Termination ensures both sides finish sending and delayed segments do not interfere with later connections.",
      example:
        "SYN and FIN consume sequence numbers despite carrying no application data; these are phantom bytes.",
    },
  },
  {
    id: "long-tcp-002",
    type: "long",
    topic: "tcp",
    year: 2026,
    difficulty: "hard",
    marks: 10,
    question:
      "Explain TCP sequence numbers, acknowledgement numbers and window advertisements.",
    answer: {
      definition:
        "TCP treats communication as a byte stream and numbers bytes using sequence numbers.",
      mechanism:
        "The sequence number identifies the first byte in a segment. The acknowledgement number identifies the next byte expected. The advertised window states how many bytes the receiver can still accept.",
      purpose:
        "These fields provide reliable ordered delivery and flow control.",
      example:
        "If bytes up to 900 have been received, the ACK is 901. If the receive buffer has 1900 bytes free, the advertised window is 1900.",
    },
  },
  {
    id: "long-tcp-003",
    type: "long",
    topic: "tcp",
    year: 2026,
    difficulty: "medium",
    marks: 10,
    question:
      "Explain TCP retransmission, acknowledgement and keepalive timers.",
    answer: {
      definition:
        "TCP uses timers to handle loss, delayed acknowledgements and idle connections.",
      mechanism:
        "The retransmission timeout retransmits unacknowledged segments. The acknowledgement timer sends an ACK when no piggy-back opportunity occurs. The keepalive timer sends probes after long inactivity.",
      purpose:
        "Timers improve reliability and avoid wasting resources on broken connections.",
      example:
        "If a segment is not acknowledged before the retransmission timeout expires, TCP retransmits it.",
    },
  },
  {
    id: "long-tcp-004",
    type: "long",
    topic: "tcp",
    year: 2026,
    difficulty: "medium",
    marks: 10,
    question: "Explain how TCP handles congestion.",
    answer: {
      definition:
        "Congestion occurs when the network cannot cope with the offered traffic load.",
      mechanism:
        "TCP uses a congestion window, slow start, acknowledgements and loss detection to adjust the sending rate.",
      purpose:
        "The goal is to reduce IP datagram loss and avoid overwhelming the network.",
      example:
        "During slow start, cwnd begins small and grows as acknowledgements arrive. Loss causes TCP to reduce its sending rate.",
    },
  },
  {
    id: "long-utf8-001",
    type: "long",
    topic: "utf8",
    year: 2026,
    difficulty: "medium",
    marks: 10,
    question: "Explain how UTF-8 encodes Unicode code points.",
    answer: {
      definition:
        "UTF-8 is a variable-length encoding for Unicode code points.",
      mechanism:
        "ASCII characters use one byte. Larger code points use leading-byte patterns 110, 1110 or 11110 followed by continuation bytes of the form 10xxxxxx.",
      purpose:
        "UTF-8 represents Unicode while remaining compatible with ASCII for the first 128 characters.",
      example:
        "A three-byte UTF-8 sequence has the form 1110xxxx 10xxxxxx 10xxxxxx.",
    },
  },
  {
    id: "long-utf8-002",
    type: "long",
    topic: "utf8",
    year: 2026,
    difficulty: "hard",
    marks: 10,
    question: "Convert U+00E4, U+039E and U+179F to UTF-8.",
    answer: {
      definition:
        "Unicode code points are converted to UTF-8 by placing their binary bits into the correct UTF-8 byte pattern.",
      mechanism:
        "U+00E4 uses two bytes, U+039E uses two bytes, and U+179F uses three bytes.",
      purpose:
        "The conversion shows how abstract Unicode code points are represented as transmitted bytes.",
      example: "U+00E4 = C3 A4; U+039E = CE 9E; U+179F = E1 9E 9F.",
    },
  },
  {
    id: "long-dns-001",
    type: "long",
    topic: "dns",
    year: 2026,
    difficulty: "medium",
    marks: 10,
    question: "Explain recursive DNS resolution.",
    answer: {
      definition:
        "Recursive DNS resolution is the process where a resolver obtains an answer on behalf of a client.",
      mechanism:
        "The resolver may query root servers, TLD servers and authoritative name servers until it finds the required record.",
      purpose: "It hides the complexity of the DNS hierarchy from the client.",
      example:
        "Resolving www.example.com may involve asking a root server, then a .com server, then the authoritative server for example.com.",
    },
  },
  {
    id: "long-dns-002",
    type: "long",
    topic: "dns",
    year: 2026,
    difficulty: "medium",
    marks: 10,
    question:
      "Create the main DNS records for a domain with two name servers, one web server and two mail servers.",
    answer: {
      definition: "A DNS zone file contains resource records for a domain.",
      mechanism:
        "NS records identify authoritative name servers, A records map hostnames to IPv4 addresses, and MX records identify mail servers with priorities.",
      purpose:
        "The records allow clients and mail systems to find the services for the domain.",
      example:
        "@ NS ns1.example.; @ NS ns2.example.; www A 192.0.2.10; @ MX 10 mail1.example.; @ MX 20 mail2.example.",
    },
  },
  {
    id: "long-http-001",
    type: "long",
    topic: "http",
    year: 2026,
    difficulty: "medium",
    marks: 10,
    question:
      "Explain the purpose of HTTP response lines and headers such as HTTP/1.1 200 OK and Content-Type: text/html.",
    answer: {
      definition:
        "An HTTP response contains a status line, headers, a blank line and optionally a response body.",
      mechanism:
        "HTTP/1.1 200 OK indicates the protocol version and successful processing. Content-Type states the MIME type of the body.",
      purpose: "These fields tell the client how to interpret the response.",
      example:
        "Content-Type: text/html tells the browser the body contains HTML.",
    },
  },
  {
    id: "long-email-001",
    type: "long",
    topic: "email",
    year: 2026,
    difficulty: "medium",
    marks: 10,
    question: "Explain POP3 and list important commands.",
    answer: {
      definition:
        "POP3 is an application-layer protocol used by clients to retrieve email from a server mailbox.",
      mechanism:
        "A POP3 session typically moves through authorization, transaction and update states. Commands include USER, PASS, STAT, LIST, RETR, DELE and QUIT.",
      purpose:
        "It enables a mail client to access and retrieve messages stored on a mail server.",
      example:
        "The client may issue USER, PASS, LIST, RETR 1, DELE 1 and QUIT.",
    },
  },
  {
    id: "long-email-002",
    type: "long",
    topic: "email",
    year: 2026,
    difficulty: "medium",
    marks: 10,
    question: "Explain SMTP and its core command sequence.",
    answer: {
      definition:
        "SMTP is an application-layer protocol used to send or relay email.",
      mechanism:
        "A typical exchange uses HELO/EHLO, MAIL FROM, RCPT TO, DATA and QUIT.",
      purpose:
        "It transfers messages from a client or mail server to another mail server.",
      example:
        "MAIL FROM identifies the envelope sender, while RCPT TO identifies the envelope recipient.",
    },
  },
  {
    id: "long-routing-001",
    type: "long",
    topic: "routing",
    year: 2026,
    difficulty: "hard",
    marks: 10,
    question: "Explain Dijkstra's algorithm as used by OSPF.",
    answer: {
      definition:
        "Dijkstra's algorithm computes shortest paths from one node to all other nodes in a weighted graph.",
      mechanism:
        "It repeatedly selects the lowest-cost candidate node, marks it done and updates costs to its neighbours.",
      purpose:
        "OSPF uses it to calculate shortest-path routes based on a link-state database.",
      example:
        "If A has tentative costs to B, C and G, the lowest-cost candidate becomes the next done node.",
    },
  },
  {
    id: "long-routing-002",
    type: "long",
    topic: "routing",
    year: 2025,
    difficulty: "medium",
    marks: 10,
    question: "Compare RIP, OSPF and BGP.",
    answer: {
      definition: "RIP, OSPF and BGP are routing protocols.",
      mechanism:
        "RIP is a distance-vector protocol using hop count. OSPF is a link-state interior protocol using Dijkstra. BGP is an exterior gateway protocol used between autonomous systems.",
      purpose:
        "They exchange routing information so routers can forward traffic toward destinations.",
      example:
        "A campus network may use OSPF internally while its ISP uses BGP for inter-AS routing.",
    },
  },
  {
    id: "long-asn1-001",
    type: "long",
    topic: "asn1",
    year: 2025,
    difficulty: "medium",
    marks: 10,
    question: "Explain ASN.1 and BER.",
    answer: {
      definition:
        "ASN.1 is a notation for describing structured data independent of programming language or machine representation.",
      mechanism:
        "BER provides encoding rules that convert ASN.1 values into bytes.",
      purpose:
        "They allow systems to exchange structured information unambiguously.",
      example:
        "A SEQUENCE may be described in ASN.1 and then encoded using BER.",
    },
  },
  {
    id: "long-asn1-002",
    type: "long",
    topic: "asn1",
    year: 2025,
    difficulty: "medium",
    marks: 10,
    question: "Explain LDAP and the Directory Information Tree.",
    answer: {
      definition: "LDAP is a directory access protocol.",
      mechanism:
        "Directory entries are arranged hierarchically in a Directory Information Tree.",
      purpose:
        "LDAP enables clients to search and access structured directory information.",
      example: "An organisation may store users and departments in a DIT.",
    },
  },
  {
    id: "long-layer2-001",
    type: "long",
    topic: "layer2",
    year: 2026,
    difficulty: "medium",
    marks: 5,
    question: "Explain Token Ring medium access control.",
    answer: {
      definition:
        "Token Ring is a token-passing Layer 2 protocol associated with IEEE 802.5.",
      mechanism:
        "A token circulates around the ring and only the station holding the token may transmit.",
      purpose: "This prevents collisions by controlling access to the medium.",
      example:
        "The active monitor handles problems such as lost tokens or orphan frames.",
    },
  },
  {
    id: "long-layer2-002",
    type: "long",
    topic: "layer2",
    year: 2026,
    difficulty: "medium",
    marks: 10,
    question: "Explain data delineation and error control at Layer 2.",
    answer: {
      definition:
        "Data delineation marks frame boundaries, while error control detects or corrects transmission errors.",
      mechanism:
        "Protocols may use flags, preambles or length fields for delineation, and parity, checksums or CRCs for error detection.",
      purpose:
        "The receiver must know where a frame starts and ends and whether it was corrupted.",
      example: "HDLC uses the flag 01111110 for frame boundaries.",
    },
  },
  {
    id: "long-ip-001",
    type: "long",
    topic: "ipv4_ipv6",
    year: 2026,
    difficulty: "medium",
    marks: 10,
    question: "Explain NAT and why it delays IPv4 address exhaustion.",
    answer: {
      definition:
        "Network Address Translation translates private addresses, and often ports, to public addresses.",
      mechanism:
        "A NAT device rewrites source IP addresses and port numbers and keeps a translation table.",
      purpose:
        "It allows many private hosts to share one public IPv4 address, conserving public address space.",
      example:
        "Several home devices using 192.168.1.0/24 can access the Internet through one public address.",
    },
  },
  {
    id: "long-ip-002",
    type: "long",
    topic: "ipv4_ipv6",
    year: 2025,
    difficulty: "medium",
    marks: 10,
    question: "Explain ARP and ICMP ping.",
    answer: {
      definition:
        "ARP resolves IPv4 addresses to MAC addresses; ICMP provides control messages for IP.",
      mechanism:
        "ARP broadcasts a request on the local link and receives the MAC address in a reply. Ping sends ICMP Echo Requests and expects Echo Replies.",
      purpose: "ARP enables local frame delivery. Ping tests reachability.",
      example:
        "Before sending to 192.168.1.1 on Ethernet, a host may use ARP to find its MAC address.",
    },
  },
  {
    id: "long-osi-001",
    type: "long",
    topic: "osi",
    year: 2026,
    difficulty: "medium",
    marks: 10,
    question: "List the seven OSI layers and give the key function of each.",
    answer: {
      definition: "The OSI model is a layered reference model for networking.",
      mechanism:
        "Layer 7 application supports application protocols; 6 presentation handles representation; 5 session handles dialogue/session control; 4 transport handles process-to-process delivery; 3 network handles routing; 2 data link handles frames and MAC; 1 physical handles signal transmission.",
      purpose:
        "The model separates networking functions into understandable layers.",
      example:
        "HTTP is Layer 7, TCP is Layer 4, IP is Layer 3 and Ethernet is Layer 2.",
    },
  },
  {
    id: "long-mime-001",
    type: "long",
    topic: "http",
    year: 2025,
    difficulty: "medium",
    marks: 10,
    question: "Explain MIME and why Content-Type matters.",
    answer: {
      definition:
        "MIME defines media types and structures for representing content.",
      mechanism:
        "A Content-Type value such as text/html or multipart/mixed tells the receiver how the body is structured and should be interpreted.",
      purpose:
        "It allows systems such as email clients and browsers to process different kinds of content correctly.",
      example:
        "An email attachment may use multipart/mixed, while a web page may use text/html.",
    },
  },
];

const topicGuidance: Record<Topic, { definition: string; purpose: string }> = {
  subnetting: {
    definition:
      "CIDR expresses an IPv4 network using a variable-length prefix that separates network bits from host bits.",
    purpose:
      "Subnet calculations allocate address space efficiently and identify valid network, host, and broadcast addresses.",
  },
  tcp: {
    definition:
      "TCP is a connection-oriented transport protocol that provides a reliable, ordered byte stream using TCP segments.",
    purpose:
      "TCP sequencing, acknowledgements, retransmission timeout, and congestion window rules provide reliable delivery without overwhelming the receiver or network.",
  },
  utf8: {
    definition:
      "UTF-8 is a variable-length Unicode encoding that uses one to four bytes per code point.",
    purpose:
      "Correct prefix and continuation bits let systems exchange Unicode text while preserving ASCII compatibility.",
  },
  dns: {
    definition:
      "DNS is a hierarchical distributed naming system that stores typed resource records.",
    purpose:
      "Recursive resolution finds answers for clients, while delegation assigns authority for parts of the namespace.",
  },
  routing: {
    definition:
      "Routing selects paths so routers can forward IP datagrams between networks.",
    purpose:
      "Routing algorithms and protocols calculate usable, loop-free paths toward destination prefixes.",
  },
  http: {
    definition:
      "HTTP is an application-layer request-response protocol whose headers describe message handling and representation metadata.",
    purpose:
      "Headers and MIME types let clients and servers interpret content and manage requests consistently.",
  },
  email: {
    definition:
      "Internet email uses SMTP for message transfer and POP3 for mailbox retrieval.",
    purpose:
      "Protocol commands move mail through explicit states while preserving sender, recipient, and message boundaries.",
  },
  asn1: {
    definition:
      "ASN.1 describes structured data independently of a programming language, while BER defines its byte encoding.",
    purpose:
      "The notation and encoding rules let heterogeneous systems exchange structured values unambiguously.",
  },
  layer2: {
    definition:
      "Layer 2 transfers frames over a local link using addressing, medium access, delineation, and error detection.",
    purpose:
      "These mechanisms coordinate access to a shared medium and deliver frames to the correct local interface.",
  },
  ipv4_ipv6: {
    definition:
      "IPv4 and IPv6 provide logical addressing for IP datagrams; supporting protocols resolve local addresses and report network conditions.",
    purpose:
      "ARP, NAT, ICMP, and IPv6 address or mitigate practical delivery, reachability, and address-space requirements.",
  },
  osi: {
    definition:
      "The OSI model separates network communication into seven layers with defined responsibilities.",
    purpose:
      "Layering makes protocol responsibilities, service boundaries, and troubleshooting easier to reason about.",
  },
};

function structureExplanation(question: MCQQuestion): string {
  const guidance = topicGuidance[question.topic];
  const correctOption = question.options[question.correctAnswer];

  return [
    `1. Definition: ${guidance.definition}`,
    `2. Mechanism: ${question.explanation}`,
    `3. Purpose: ${guidance.purpose}`,
    `4. Example: For this question, the correct application is “${correctOption}”.`,
  ].join("\\n");
}

export const mcqQuestions: MCQQuestion[] = rawMcqQuestions.map((question) =>
  mcqQuestionSchema.parse({
    ...question,
    explanation: structureExplanation(question),
  }),
);

export const longQuestions: LongQuestion[] = rawLongQuestions.map((question) =>
  longQuestionSchema.parse(question),
);

export const questions: Question[] = questionBankSchema.parse([
  ...mcqQuestions,
  ...longQuestions,
]);
