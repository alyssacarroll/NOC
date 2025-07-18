const formTemplates = {
  // Data Center Walkthrough Check
  '01': `
  <input type="hidden" name="checkNumber" value="01" />
  <div class="form-content">
    <label><input type="checkbox" name="Completed" value="TRUE"> Walkthrough Completed</label>
    <label>Comments:
      <textarea name="Notes" rows="3" style="width:100%;"></textarea>
    </label>
  </div>
  `,
  // Tech Support Email Check
  '02': `
  <input type="hidden" name="checkNumber" value="02" />
  <div class="form-content">
    <label><input type="checkbox" name="Completed" value="TRUE"> Email Checked</label>
    <label>Comments:
      <textarea name="Notes" rows="3" style="width:100%;"></textarea>
    </label>
  </div>
  `,
  // VPN TAK & WAVE Check
  '03': `
  <input type="hidden" name="checkNumber" value="03" />
  <div class="form-content">
    <label><input type="checkbox" name="Completed" value="TRUE"> Check Completed</label>
    <label>Comments:
      <textarea name="Notes" rows="2" style="width:100%;"></textarea>
    </label>
  </div>
  `,
  // WUG Check
  '04': `
  <input type="hidden" name="checkNumber" value="04" />
  <div class="form-content">
    <label><input type="checkbox" name="Completed" value="TRUE"> Check Completed</label>
    <label>Comments:
      <textarea name="Notes" rows="2" style="width:100%;"></textarea>
    </label>
  </div>
  `,
  // TAK Server Federation Check
  '05': `
  <input type="hidden" name="checkNumber" value="05" />
  <div class="form-content">
    <label><input type="checkbox" name="Completed" value="TRUE"> Check Completed</label>
    <label>Comments:
      <textarea name="Notes" rows="2" style="width:100%;"></textarea>
    </label>
  </div>
  `,
  // PTL Check
  '06': `
  <input type="hidden" name="checkNumber" value="06" />
  <div class="form-content">
    <label><input type="checkbox" name="Completed" value="TRUE"> Check Completed</label>
    <label>Comments:
      <textarea name="Notes" rows="2" style="width:100%;"></textarea>
    </label>
  </div>
  `,
  // Message Check
  '07': `
  <input type="hidden" name="checkNumber" value="07" />
  <div class="form-content">

    <label style="padding-top: 10px;">Data:
      <div align="center" style="display: flex; gap: 20px; justify-content: center; padding-top: 10px;">
        <textarea name="Total Device Count" rows="1" placeholder="Total Device Count"
          style="width:21%; font-size:0.80rem;"></textarea>
        <textarea name="Raw Messages" rows="1" placeholder="Raw Messages"
          style="width:21%; font-size:0.80rem;"></textarea>
        <textarea name="Unique IMEIs" rows="1" placeholder="Unique IMEIs"
          style="width:21%; font-size:0.80rem;"></textarea>
        <textarea name="Free Disk Space" rows="1" placeholder="Free Disk Space"
          style="width:21%; font-size:0.80rem;"></textarea>
      </div>
    </label>

  </div>
  `,
  // Landing Pad Server Check
  '08': `
  <input type="hidden" name="checkNumber" value="08" />
  <div class="form-content">
    <label><input type="checkbox" name="Completed" value="TRUE"> Check Completed</label>
    <label>Comments:
      <textarea name="Notes" rows="3" style="width:100%;"></textarea>
    </label>
  </div>
  `,
  // DS File Check
  '09': `
  <input type="hidden" name="checkNumber" value="09" />
  <div class="form-content">
    <label><input type="checkbox" name="Completed" value="TRUE"> Check Completed</label>
    <label>Comments:
      <textarea name="Notes" rows="3" style="width:100%;"></textarea>
    </label>
  </div>
  `,
  // WAVE Server Check
  '10': `
  <input type="hidden" name="checkNumber" value="10" />

  <div class="fly-grid">
    <div class="fly-item">
      <span>Fly-216N</span>
      <label class="switch-10"><input type="checkbox" name="Fly-216N"><span class="slider-10"></span></label>
    </div>
    <div class="fly-item">
      <span>Fly-228</span>
      <label class="switch-10"><input type="checkbox" name="Fly-228"><span class="slider-10"></span></label>
    </div>
    <div class="fly-item">
      <span>Fly-238</span>
      <label class="switch-10"><input type="checkbox" name="Fly-238"><span class="slider-10"></span></label>
    </div>
    <div class="fly-item">
      <span>WAVE-PRXY12019.ptbportal.us</span>
      <label class="switch-10"><input type="checkbox" name="WAVE-PRXY12019.ptbportal.us"><span class="slider-10"></span></label>
    </div>
    <div class="fly-item">
      <span>Fly-220</span>
      <label class="switch-10"><input type="checkbox" name="Fly-220"><span class="slider-10"></span></label>
    </div>

    <div class="fly-item">
      <span>Fly-230</span>
      <label class="switch-10"><input type="checkbox" name="Fly-230"><span class="slider-10"></span></label>
    </div>
    <div class="fly-item">
      <span>Fly-240</span>
      <label class="switch-10"><input type="checkbox" name="Fly-240"><span class="slider-10"></span></label>
    </div>
    <div class="fly-item">
      <span>WAVE-PRXY22019.ptbportal.us</span>
      <label class="switch-10"><input type="checkbox" name="WAVE-PRXY22019.ptbportal.us"><span class="slider-10"></span></label>
    </div>
    <div class="fly-item">
      <span>Fly-222</span>
      <label class="switch-10"><input type="checkbox" name="Fly-222"><span class="slider-10"></span></label>
    </div>
    <div class="fly-item">
      <span>Fly-232</span>
      <label class="switch-10"><input type="checkbox" name="Fly-232"><span class="slider-10"></span></label>
    </div>

    <div class="fly-item">
      <span>Fly-242</span>
      <label class="switch-10"><input type="checkbox" name="Fly-242"><span class="slider-10"></span></label>
    </div>
    <div class="fly-item">
      <span>WAVE-MANMED2019.ptbportal.us</span>
      <label class="switch-10"><input type="checkbox" name="WAVE-MANMED2019.ptbportal.us"><span class="slider-10"></span></label>
    </div>
    <div class="fly-item">
      <span>Fly-224</span>
      <label class="switch-10"><input type="checkbox" name="Fly-224"><span class="slider-10"></span></label>
    </div>
    <div class="fly-item">
      <span>Fly-234</span>
      <label class="switch-10"><input type="checkbox" name="Fly-234"><span class="slider-10"></span></label>
    </div>
    <div class="fly-item">
      <span>MED to VPI</span>
      <label class="switch-10"><input type="checkbox" name="MED to VPI"><span class="slider-10"></span></label>
    </div>

    <div class="fly-item">
      <span>EASTERN EUROPE Vocality</span>
      <label class="switch-10"><input type="checkbox" name="EASTERN EUROPE Vocality"><span class="slider-10"></span></label>
    </div>
    <div class="fly-item">
      <span>Fly-226</span>
      <label class="switch-10"><input type="checkbox" name="Fly-226"><span class="slider-10"></span></label>
    </div>
    <div class="fly-item">
      <span>Fly-236</span>
      <label class="switch-10"><input type="checkbox" name="Fly-236"><span class="slider-10"></span></label>
    </div>
    <div class="fly-item">
      <span>SA14WAVE511MS</span>
      <label class="switch-10"><input type="checkbox" name="SA14WAVE511MS"><span class="slider-10"></span></label>
    </div>
</div>
`,
  // Eaton Dashboard Check
  '11': `
  <input type="hidden" name="checkNumber" value="11" />
  <div class="form-content">
    <label><input type="checkbox" name="Completed" value="TRUE"> Check Completed</label>
    <label>Comments:
      <textarea name="Notes" rows="3" style="width:100%;"></textarea>
    </label>
  </div>
  `,
  // InControl Check
  '12': `
  <input type="hidden" name="checkNumber" value="12" />
  <div class="form-content">
    <label><input type="checkbox" name="Completed" value="TRUE"> Check Completed</label>
    <label>Comments:
      <textarea name="Notes" rows="3" style="width:100%;"></textarea>
    </label>
  </div>
  `,
  // Veeam Daily Backup Check
  '13': `
  <input type="hidden" name="checkNumber" value="13" />
  <div class="form-content">
    <label><input type="checkbox" name="Completed" value="TRUE"> Daily Backup Completed</label>
    <label>Comments:
      <textarea name="Notes" rows="3" style="width:100%;"></textarea>
    </label>
  </div>
  `,
  // PTB Server Checks
  '14': `
  <input type="hidden" name="checkNumber" value="14" />
  <div class="form-content">
    <label><input type="checkbox" name="Completed" value="TRUE"> Check Completed</label>
    <label>Comments:
      <textarea name="Notes" rows="3" style="width:100%;"></textarea>
    </label>
  </div>
  `,
  // IPsec Check
  '15': `
  <input type="hidden" name="checkNumber" value="15" />
  <div class="form-content">
    <label><input type="checkbox" name="Completed" value="TRUE"> Check Completed</label>
    <label>Comments:
      <textarea name="Notes" rows="3" style="width:100%;"></textarea>
    </label>
  </div>
  `,
  // BH2 Check
  '16': `
  <input type="hidden" name="checkNumber" value="16" />
  <div class="form-content">
    <label><input type="checkbox" name="Completed" value="TRUE"> Check Completed</label>
    <label>Comments:
      <textarea name="Notes" rows="3" style="width:100%;"></textarea>
    </label>
  </div>
  `,
};