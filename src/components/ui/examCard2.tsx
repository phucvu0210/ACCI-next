const aftersick = { fontFamily: '"Aftersick DEMO", Arial, sans-serif' };
const goldplay = { fontFamily: 'Goldplay, Arial, sans-serif' };

export default function ExamCard({ data }: { data: any }) {
  if (!data) return null;

  return (
    <div
      className="border-2 rounded-md p-4 w-full"
      style={{ borderColor: '#F16F33', backgroundColor: 'rgba(252, 226, 169, 0.5)' }}
    >
      <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-base">
        <div>
          <span className="block">
            <strong
              className="title-font"
              style={{ ...aftersick, fontWeight: 400 }} // Explicitly set semibold
            >
              Name:
            </strong>{' '}
            <span className="data-font" style={goldplay}>
              {data.name}
            </span>
          </span>
          <span className="block">
            <strong
              className="title-font"
              style={{ ...aftersick, fontWeight: 400 }}
            >
              CID:
            </strong>{' '}
            <span className="data-font" style={goldplay}>
              {data.cid}
            </span>
          </span>
          <span className="block">
            <strong
              className="title-font"
              style={{ ...aftersick, fontWeight: 400 }}
            >
              Exam:
            </strong>{' '}
            <span className="data-font" style={goldplay}>
              {data.exam}
            </span>
          </span>
          <span className="block">
            <strong
              className="title-font"
              style={{ ...aftersick, fontWeight: 400 }}
            >
              Register Type:
            </strong>{' '}
            <span className="data-font" style={goldplay}>
              {data.registerType}
            </span>
          </span>
        </div>
        <div>
          <span className="block">
            <strong
              className="title-font"
              style={{ ...aftersick, fontWeight: 400 }}
            >
              Issue Date:
            </strong>{' '}
            <span className="data-font" style={goldplay}>
              {data.issueDate}
            </span>
          </span>
          <span className="block">
            <strong
              className="title-font"
              style={{ ...aftersick, fontWeight: 400 }}
            >
              ID:
            </strong>{' '}
            <span className="data-font" style={goldplay}>
              {data.id}
            </span>
          </span>
          <span className="block">
            <strong
              className="title-font"
              style={{ ...aftersick, fontWeight: 400 }}
            >
              Room:
            </strong>{' '}
            <span className="data-font" style={goldplay}>
              {data.room}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}