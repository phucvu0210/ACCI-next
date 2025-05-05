const aftersick = { fontFamily: '"Aftersick DEMO", Arial, sans-serif' }
const goldplay = { fontFamily: 'Goldplay, Arial, sans-serif' }

export default function ExamCard({ data }: { data: any }) {
  if (!data) {
    return null
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return isNaN(date.getTime()) ? '-' : date.toLocaleDateString('vi-VN')
  }

  return (
    <div
      className="border-2 rounded-md p-4 w-full"
      style={{
        borderColor: '#F16F33',
        backgroundColor: 'rgba(252, 226, 169, 0.5)'
      }}
    >
      <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-base text-black">
        <div>
          <span className="block">
            <strong
              className="title-font"
              style={{ ...aftersick, fontWeight: 400 }}
            >
              Name:
            </strong>{' '}
            <span className="data-font" style={goldplay}>
              {data.name ?? '-'}
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
              {data.exam ?? '-'}
            </span>
          </span>
          <span className="block">
            <strong
              className="title-font"
              style={{ ...aftersick, fontWeight: 400 }}
            >
              Status:
            </strong>{' '}
            <span className="data-font" style={goldplay}>
              {data.trangThai ?? '-'}
            </span>
          </span>
          <span className="block opacity-0">
            <strong
              className="title-font"
              style={{ ...aftersick, fontWeight: 400 }}
            >
              Original time:
            </strong>{' '}
            <span className="data-font" style={goldplay}>
              {/* Placeholder for spacing */}
              {formatDate(data.pgh?.tgThiCu)}
            </span>
          </span>
          <span className="block">
            <strong
              className="title-font"
              style={{ ...aftersick, fontWeight: 400 }}
            >
              Original time:
            </strong>{' '}
            <span className="data-font" style={goldplay}>
              {formatDate(data.pgh?.tgThiCu)}
            </span>
          </span>

          <span className="block">
            <strong
              className="title-font"
              style={{ ...aftersick, fontWeight: 400 }}
            >
              Reason:
            </strong>{' '}
            <span className="data-font" style={goldplay}>
              {data.pgh?.lyDo?.trim() || '-'}
            </span>
          </span>
        </div>
        <div>
          <span className="block">
            <strong
              className="title-font"
              style={{ ...aftersick, fontWeight: 400 }}
            >
              Birthday:
            </strong>{' '}
            <span className="data-font" style={goldplay}>
              {formatDate(data.chiTietDangKy?.ngaySinh)}
            </span>
          </span>
          <span className="block">
            <strong
              className="title-font"
              style={{ ...aftersick, fontWeight: 400 }}
            >
              Issue Date:
            </strong>{' '}
            <span className="data-font" style={goldplay}>
              {data.issueDate ?? '-'}
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
              {data.id ?? '-'}
            </span>
          </span>
          <span className="block opacity-0">
            <strong
              className="title-font"
              style={{ ...aftersick, fontWeight: 400 }}
            >
              Reason:
            </strong>{' '}
            <span className="data-font" style={goldplay}>
              {data.id ?? '-'}
            </span>
          </span>
          <span className="block">
            <strong
              className="title-font"
              style={{ ...aftersick, fontWeight: 400 }}
            >
              Extended time:
            </strong>{' '}
            <span className="data-font" style={goldplay}>
              {formatDate(data.pgh?.tgThiMoi)}
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}
