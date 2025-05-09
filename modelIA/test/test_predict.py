# modelIA/tests/test_predict.py
import io
import pytest
from modelIA.main import app
@pytest.fixture
def client():
    return app.test_client()

def make_dummy_image():
    from PIL import Image
    import numpy as np
    img = Image.fromarray((np.random.rand(224,224,3)*255).astype('uint8'))
    buf = io.BytesIO()
    img.save(buf, format='JPEG')
    buf.seek(0)
    return buf

def test_predict_success(client):
    data = {
        'images': [ (make_dummy_image(), f'img{i}.jpg') for i in range(3) ]
    }
    resp = client.post('/predict', content_type='multipart/form-data', data=data)
    assert resp.status_code == 200
    json = resp.get_json()
    assert 'predictions' in json
    assert len(json['predictions']) == 3
