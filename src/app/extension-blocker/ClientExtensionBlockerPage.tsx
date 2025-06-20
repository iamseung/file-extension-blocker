'use client';

import { useEffect, useState } from 'react';

type ExtensionDto = {
  id: number;
  name: string;
  checked: boolean;
};

type FixedExtensionResponse = {
  message: string;
  data: ExtensionDto[];
};

export default function ClientExtensionBlockerPage() {
  const [fixedExtensions, setFixedExtensions] = useState<ExtensionDto[]>([]);
  const [customExtensions, setCustomExtensions] = useState<ExtensionDto[]>([]);
  const [customInput, setCustomInput] = useState('');

  // ✅ 고정 확장자 fetch
  const fetchFixedExtensions = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/blocking/extensions/fixed', {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }
      const data: FixedExtensionResponse = await res.json();
      setFixedExtensions(data.data);
    } catch (e) {
      console.error(e);
      alert('고정 확장자 로딩 실패: ' + (e as Error).message);
      setFixedExtensions([]);
    }
  };

  // ✅ 커스텀 확장자 fetch
  const fetchCustomExtensions = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/blocking/extensions/custom', {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }
      const data: FixedExtensionResponse = await res.json();
      setCustomExtensions(data.data);
    } catch (e) {
      console.error(e);
      alert('커스텀 확장자 로딩 실패: ' + (e as Error).message);
      setCustomExtensions([]);
    }
  };

  useEffect(() => {
    fetchFixedExtensions();
    fetchCustomExtensions();
  }, []);

  // ✅ 고정 확장자 토글
  const handleToggle = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8080/api/blocking/extensions/fixed/${id}/toggle`, {
        method: 'PATCH',
        credentials: 'include',
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }
      await fetchFixedExtensions();
    } catch (e) {
      console.error(e);
      alert('토글 실패: ' + (e as Error).message);
    }
  };

  // ✅ 커스텀 확장자 추가
  const addCustomExtension = () => {
    const trimmed = customInput.trim();

    if (!trimmed) return;

    const isDuplicate = customExtensions.some(
        ext => ext.name.toLowerCase() === trimmed.toLowerCase()
    );

    if (isDuplicate) {
        alert('동일한 확장자는 이미 추가되어 있습니다.');
        return;
    }

    if (customExtensions.length >= 200) {
        alert('최대 200개까지만 추가할 수 있습니다.');
        return;
    }

    fetch('http://localhost:8080/api/blocking/extensions/custom', {
        method: 'POST',
        credentials: 'include',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ extensionName: trimmed }),
    })
        .then(res => {
        if (!res.ok) return res.json().then(err => Promise.reject(err));
        return fetchCustomExtensions();
        })
        .then(() => setCustomInput(''))
        .catch(err => {
        alert(err.message || '커스텀 확장자 추가 실패');
        console.error('커스텀 확장자 추가 실패:', err);
        });
    };

  // ✅ 커스텀 확장자 삭제
  const removeCustomExtension = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8080/api/blocking/extensions/custom/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }
      await fetchCustomExtensions();
    } catch (e) {
      console.error(e);
      alert('삭제 실패: ' + (e as Error).message);
    }
  };

  return (
    <main className="p-6 max-w-xl mx-auto text-sm">
      <h1 className="text-xl font-bold mb-4">◎ 파일 확장자 차단</h1>
      <p className="mb-6 text-gray-700">
        파일확장자에 따라 특정 형식의 파일을 첨부하거나 전송하지 못하도록 제한
      </p>

      {/* 고정 확장자 */}
      <section className="mb-6">
        <div className="font-semibold mb-2">1️⃣ 고정 확장자</div>
        {fixedExtensions.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {fixedExtensions.map(ext => (
              <label key={ext.id} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={ext.checked}
                  onChange={() => handleToggle(ext.id)}
                />
                <span>{ext.name}</span>
              </label>
            ))}
          </div>
        ) : (
          <div className="text-red-500">고정 확장자 정보를 불러올 수 없습니다.</div>
        )}
      </section>

      {/* 커스텀 확장자 */}
      <section>
        <div className="font-semibold mb-2">2️⃣ 커스텀 확장자</div>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="확장자 입력"
            className="border px-2 py-1 rounded w-48"
            value={customInput}
            onChange={e => setCustomInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCustomExtension()}
          />
          <button
            onClick={addCustomExtension}
            className="bg-gray-800 text-white px-3 py-1 rounded"
          >
            +추가
          </button>
        </div>
        <div className="text-xs text-gray-500 mb-1">{customExtensions.length}/200</div>
        <div className="flex flex-wrap gap-2">
          {customExtensions.map(ext => (
            <div
              key={ext.id}
              className="bg-gray-200 text-black rounded-full px-3 py-1 flex items-center gap-2"
            >
              <span>{ext.name}</span>
              <button
                onClick={() => removeCustomExtension(ext.id)}
                className="text-red-500 font-bold"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}